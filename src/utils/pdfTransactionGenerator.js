const PDFDocument = require('pdfkit');
const moment = require('moment');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

class PDFTransactionReportGenerator {
    constructor(config = {}) {
        this.config = {
            primaryColor: '#2c3e50',
            secondaryColor: '#7f8c8d',
            accentColor: '#3498db',
            fontNormal: 'Helvetica',
            fontBold: 'Helvetica-Bold',
            titleFontSize: 20,
            headerFontSize: 12,
            bodyFontSize: 10,
            footerFontSize: 8,
            margin: 50,
            logoCacheDir: './.logo_cache',
            logoMaxWitdh: 150,
            logoMaxHeight: 80,
            ...config,
        };

        // ensure cache directory exists
        if (!fs.existsSync(this.config.logoCacheDir)) {
            fs.mkdirSync(this.config.logoCacheDir, { recursive: true });
        }
    }

    generateTransactionReport(reportData) {
        const doc = new PDFDocument({
            margin: this.config.margin,
            bufferPages: true,
            info: {
                Title: `Transaction Report - ${reportData.metadata.outlet.name}`,
                Author: 'Restaurant Management System',
                CreationDate: new Date(),
            },
        });

        const buffers = [];

        return new Promise((resolve, reject) => {
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);

            (async () => {
                try {
                    // try to load logo
                    let logoImage = null;
                    if (reportData.metadata.outlet.logo_url) {
                        try {
                            logoImage = await this._loadLogoImage(
                                doc,
                                reportData.metadata.outlet.logo_url,
                                reportData.metadata.outlet.outlet_code
                            );
                        } catch (logoError) {
                            console.warn(`Failed to load logo : ${logoError.message}`);
                        }
                    }

                    this._renderCoverPage(doc, reportData.metadata);
                    this._renderHeader(doc, reportData.metadata);
                    this._renderSummary(doc, reportData);
                    this._renderTransactionTable(doc, reportData.transactions);
                    this._renderFooter(doc);

                    doc.end();
                } catch (error) {
                    reject(new Error(`PDF generation failed : ${error.message}`));
                }
            })();
        });
    }

    async _loadLogoImage(doc, logoUrl, outletCode) {
        try {
            // check cache first
            const cachePath = path.join(
                this.config.logoCacheDir,
                `${outletCode}_${path.basename(logoUrl)}`
            );

            if (fs.existsSync(cachePath)) {
                return { path: cachePath, fromCache: true };
            }

            // download logo if not in cache
            const response = await fetch(logoUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const buffer = await response.buffer();
            fs.writeFileSync(cachePath, buffer);

            return { path: cachePath, fromCache: false };
        } catch (error) {
            throw new Error(`Logo loading failed : ${error.message}`);
        }
    }

    _renderCoverPage(doc, { outlet, reportPeriod }, logoImage = null) {
        // only render cover page for reports with more than 5 pages
        doc.addPage()
            .fillColor(this.config.primaryColor)
            .font(this.config.fontBold)
            .fontSize(24)
            .text('TRANSACTION REPORT', { align: 'center' })
            .moveDown(2);
        // logo placement
        if (logoImage) {
            try {
                const logoX = (doc.page.width - this.config.logoMaxWitdh) / 2;
                doc.image(logoImage.path, logoX, doc.y, {
                    width: this.config.logoMaxWitdh,
                    height: this.config.logoMaxHeight,
                    fit: [this.config.logoMaxWitdh, this.config.logoMaxHeight],
                });
                doc.moveDown(4);
            } catch (imageError) {
                console.warn(`Failed to embed logo : ${imageError.message}`);
                doc.text(outlet.name, { align: 'center' });
            }
        } else {
            doc.text(outlet.name, { align: 'center' });
        }

        doc.fontSize(14)
            .text(
                `Period: ${moment(reportPeriod.startDate).format('LL')}-${moment(
                    reportPeriod.endDate
                ).format('LL')}`,
                { align: 'center' }
            )
            .moveDown(3)
            .fontSize(12)
            .text('Generated on : ' + moment().format('LLLL'), { align: 'center' });
    }

    _renderHeader(doc, { outlet, reportPeriod }, logoImage = null) {
        const { margin } = this.config;

        doc.addPage()
            .font(this.config.fontBold)
            .fontSize(this.config.titleFontSize)
            .fillColor(this.config.accentColor)
            .text('TRANSACTION DETAILS', { align: 'center' })
            .moveDown(0.5);

        // header with logo
        const headerHeight = 60;
        doc.rect(margin, doc.y, doc.page.width - 2 * margin, headerHeight)
            .fill('#f8f9fa')
            .stroke('#dee2e6');

        // logo in header (smaller size)
        if (logoImage) {
            try {
                const logoHeight = 30;
                const logoWidth =
                    (logoHeight / this.config.logoMaxHeight) * this.config.logoMaxWitdh;
                doc.image(logoImage.path, margin + 10, doc.y + 5, {
                    width: logoWidth,
                    height: logoHeight,
                });
            } catch (error) {
                console.warn(`Failed to render header logo : ${error.message}`);
            }
        }

        // outlet info
        const textX = logoImage ? margin + 120 : margin + 10;
        doc.font(this.config.fontNormal)
            .fontSize(this.config.headerFontSize)
            .fillColor(this.config.primaryColor)
            .text(outlet.name, textX, doc.y + 5)
            .text(outlet.address, textX, doc.y + 25)
            .text(`Phone: ${outlet.phone}`, textX, doc.y + 45)
            .text(
                `Report Period: ${moment(reportPeriod.startDate).format('L')} - ${moment(
                    reportPeriod.endDate
                ).format('L')}`,
                textX,
                doc.y + 65
            );

        doc.moveDown(2);
    }

    _renderSummary(doc, { grandTotal, totalTax, totalDiscount }) {
        doc.font(this.config.fontBold)
            .fontSize(this.config.bodyFontSize)
            .fillColor(this.config.primaryColor)
            .text('SUMMARY', { underline: true })
            .moveDown(0.5);

        // summary table
        const summaryData = [
            ['Gross Sales', this._formatCurrency(grandTotal)],
            ['Total Discount', this._formatCurrency(totalDiscount)],
            ['Total Tax', this._formatCurrency(totalTax)],
            ['Net Sales', this._formatCurrency(grandTotal - totalDiscount)],
        ];

        this._renderTable(doc, summaryData, [150, 100], true);

        doc.moveDown(1.5);
    }

    _renderTransactionTable(doc, transactions) {
        doc.font(this.config.fontBold)
            .fontSize(this.config.bodyFontSize)
            .fillColor(this.config.primaryColor)
            .text('TRANSCATION DETAILS', { underline: true })
            .moveDown(0.5);

        if (transactions.length === 0) {
            doc.font(this.config.fontNormal).text('No transaction found for this period', {
                align: 'center',
            });
            return;
        }

        // table headers
        const headers = [
            { text: 'Date', width: 80 },
            { text: 'Orders', width: 50 },
            { text: 'Subtotal', width: 70 },
            { text: 'Tax', width: 60 },
            { text: 'Discount', width: 70 },
            { text: 'Total', width: 70 },
            { text: 'Method', width: 80 },
            { text: 'Payments', width: 50 },
        ];

        // draw table header
        const startY = doc.y;
        let x = this.config.margin;

        doc.font(this.config.fontBold).fillColor('#ffffff');

        headers.forEach((header) => {
            doc.rect(x, startY, header.width, 20)
                .fill(this.config.primaryColor)
                .stroke(this.config.primaryColor);
            doc.text(header.text, x + 5, startY + 5, {
                width: header.width - 10,
                align: header.align || 'left',
            });

            x += header.width;
        });

        // table rows
        doc.font(this.config.fontNormal).fillColor(this.config.primaryColor);

        let y = startY + 20;
        transactions.forEach((transaction, index) => {
            if (y > doc.page.length - 100) {
                this._renderPageFooter(doc);
                doc.addPage();
                y = this.config.margin;
                this._renderTableHeader(doc, headers, y);
                y += 20;
            }

            x = this.config.margin;
            const rowItems = [
                { text: moment(transaction.trasaction_date).format('L'), width: 80 },
                { text: transaction.total_orders.toString(), width: 50, align: 'right' },
                {
                    text: this._formatCurrency(transaction.total_subtotal),
                    width: 70,
                    align: 'right',
                },
                { text: this._formatCurrency(transaction.total_tax), width: 60, align: 'right' },
                {
                    text: this._formatCurrency(transaction.total_discount),
                    width: 60,
                    align: 'right',
                },
                { text: this._formatCurrency(transaction.total_amount), width: 70, align: 'right' },
                { text: transaction.payment_method || 'N/A', width: 70 },
                { text: transaction.payment_count.toString(), width: 50, align: 'right' },
            ];

            // alternate row colors
            if (index % 2 === 0) {
                doc.rect(this.config.margin, y, doc.page.width - 2 * this.config.margin, 20)
                    .fill('#f8f9fa')
                    .stroke('#f8f9fa');
            }

            rowItems.forEach((item) => {
                doc.text(item.text, x + 5, y + 5, {
                    width: item.width - 10,
                    align: item.align || 'left',
                });
                x += item.width;
            });

            y += 20;
        });
    }

    _renderFooter(doc) {
        this._renderPageFooter(doc);
    }

    _renderPageFooter(doc) {
        const pageNumber = doc.bufferPageRange().count + 1;

        doc.fontSize(this.config.footerFontSize)
            .fillColor(this.config.secondaryColor)
            .text(
                `Page ${pageNumber} . Generated on ${moment().format('LLLL')}`,
                this.config.margin,
                doc.page.height - 20,
                {
                    align: 'center',
                    width: doc.page.width - 2 * this.config.margin,
                }
            );
    }

    _renderTableHeader(doc, headers, y) {
        let x = this.config.margin;

        doc.font(this.config.fontBold).fillColor('#ffffff');

        headers.forEach((header) => {
            doc.rect(x, y, header.width, 20)
                .fill(this.config.primaryColor)
                .stroke(this.config.primaryColor);

            doc.text(header.text, x + 5, y + 5, {
                width: header.width - 10,
                align: header.align || 'left',
            });
            x += header.width;
        });
    }

    _renderTable(doc, data, columnWidths, hasHeader = false) {
        const startY = doc.y;
        let y = startY;

        if (hasHeader) {
            doc.font(this.config.fontBold).fillColor(this.config.primaryColor);

            let x = this.config.margin;
            columnWidths.forEach((width, i) => {
                doc.text(data[0][i], x, y, { width, align: 'left' });
                x += width;
            });

            y += 20;
            doc.moveTo(this.config.margin, y)
                .lineTo(this.config.margin + columnWidths.reduce((a, b) => a + b, 0), y)
                .stroke();
        }

        doc.font(this.config.fontNormal).fillColor(this.config.secondaryColor);

        const startRow = hasHeader ? 1 : 0;
        for (let i = startRow; i < data.length; i++) {
            let x = this.config.margin;
            columnWidths.forEach((width, j) => {
                doc.text(data[i][j], x, y, { width, align: 'left' });
                x += 20;
            });
            y += 20;
        }

        doc.y = y + 10;
    }

    _formatCurrency(amount) {
        return new Intl.NumberFormat(
            'id-IDN',
            {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }.format(amount || 0)
        );
    }

    _formatDate(date) {
        return moment(date).format('MMM D, YYYY');
    }
}

module.exports = PDFTransactionReportGenerator;
