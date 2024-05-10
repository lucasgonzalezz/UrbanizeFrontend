import { jsPDF } from 'jspdf';
import { Injectable } from "@angular/core";
import { IPurchase, IPurchaseDetail, IPurchaseDetailPage } from "../model/model.interfaces";
import { formatDate } from "@angular/common";
import { PurchaseAjaxService } from 'src/app/service/purchase.ajax.service';
import { PurchaseDetailAjaxService } from './purchaseDetail.ajax.service';

@Injectable({
    providedIn: 'root'
})
export class PurchaseDetailPrintService {

    constructor(
        private purchaseAjaxService: PurchaseAjaxService,
        private purchaseDetailAjaxService: PurchaseDetailAjaxService
    ) { }

    private loadImage(url: string) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }

    sp = (n: number): string => n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    printFacturaCompra = (purchase_id: number): void => {
        this.purchaseAjaxService.getPurchaseById(purchase_id).subscribe({
            next: (compra: IPurchase) => {
                this.purchaseDetailAjaxService.getPurchaseDetailByCompraId(purchase_id, 10, 0, 'id', 'asc').subscribe({
                    next: (purchaseDetailPage: IPurchaseDetailPage) => {
                        const detallesCompra = purchaseDetailPage.content;

                        var doc = new jsPDF();
                        doc.setFont('Arial');
                        var imgData: string = '/assets/logo.png'
                        this.loadImage(imgData).then((logo) => {
                            doc = this.cabecera(doc, compra, logo);
                            doc.setFontSize(12);
                            var linea = 155; // espacio entre la cebecara de la tabla y la primera línea de detalle
                            let totalFactura = 0;
                            doc.setFont('Arial');
                            detallesCompra.forEach((purchaseDetail, index) => {
                                this.lineaFactura(doc, purchaseDetail, linea);
                                linea += 7;
                                if (linea > 230 && index + 1 < detallesCompra.length) {
                                    doc.addPage();
                                    doc = this.cabecera(doc, compra, logo);
                                    linea = 155;
                                    doc.setFontSize(12);
                                }
                                totalFactura += (purchaseDetail.amount * purchaseDetail.price);
                            });
                            this.endFactura(doc, linea, totalFactura, compra);
                            doc.save('Factura.pdf');
                        }).catch(error => {
                            console.error('Error al cargar el logo:', error);
                        });
                    },
                    error: (error) => {
                        console.error("Ha habido un error al obtener los detalles de la compra:", error);
                    }
                });
            },
            error: (error) => {
                console.error("Ha habido un error al obtener la compra:", error);
            }
        });
    }

    private cabecera(doc: any, compra2Print: IPurchase, logo: any): any {
        const baseX = 20;
        const topY = 20; // Distancia desde la parte superior de la página
        doc.setFont('bold');
        doc.setTextColor(22, 78, 99);
        doc.setFontSize(50);
        doc.text('Factura', baseX, topY + 10); // Alineado con la parte superior de la página

        doc.setTextColor(0); // Restaurar color de texto a negro
        doc.setFontSize(12);

        // Posicionar la imagen del logo a la derecha y alineada con la parte superior de la página
        const logoWidth = 32;
        const logoHeight = 30;
        const logoX = doc.internal.pageSize.getWidth() - logoWidth - baseX; // Posición X calculada
        const logoY = topY; // Misma altura que la parte superior de la página
        doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Posicionar "Urbanize", correo electrónico y dirección justo debajo de "Factura" y más arriba
        const urbanizeX = baseX; // Alineado a la izquierda
        const urbanizeY = topY + 27; // Más arriba que antes
        const emailY = urbanizeY + 7; // Separación entre "Urbanize" y el correo electrónico
        const addressY = emailY + 6; // Separación entre el correo electrónico y la dirección

        doc.setFontSize(24);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('bold'); // Texto en negrita
        doc.text('Urbanize', urbanizeX, urbanizeY);

        doc.setFontSize(15);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('normal'); // Texto normal
        doc.text('urbanize@gmail.com', urbanizeX, emailY);

        const clienteX = 20; // Alineado a la izquierda
        const clienteY = addressY + 13; // Posicionado más arriba

        doc.setFontSize(24);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('bold'); // Texto en negrita
        doc.text('Facturar a:', clienteX, clienteY);

        doc.setFontSize(15);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('normal'); // Texto normal
        const cliente = compra2Print?.user?.name + ' ' + compra2Print?.user.last_name1;
        doc.text(cliente, clienteX, clienteY + 9);

        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.text(compra2Print?.user?.address, clienteX, clienteY + 16);
        doc.text(compra2Print?.user?.email, clienteX, clienteY + 22);

        // Definir las posiciones X e Y para los datos adicionales
        const datosX = 100; // Alineado a la derecha
        const datosY = 83; // Misma altura que el texto del cliente

        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFontSize(15);
        doc.setFont('normal'); // Texto normal

        doc.setFont('bold'); // Texto en negrita
        // Texto "Código de compra:"
        doc.text('Código de compra:', datosX, datosY);
        doc.setFont('normal'); // Texto normal
        doc.setFontSize(11);
        doc.text(`${compra2Print.purchaseCode}`, datosX + 42, datosY);

        // Texto "Fecha de compra:"
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('normal'); // Texto normal
        doc.setFont('bold'); // Texto en negrita
        doc.setFontSize(15);
        doc.text('Fecha de compra:', datosX, datosY + 7); // Añadir separación entre líneas
        doc.setFont('normal'); // Texto normal
        doc.setFontSize(11);
        doc.text(formatDate(compra2Print.purchaseDate, 'dd/MM/yyyy', 'es-ES'), datosX + 40, datosY + 7);

        // // Texto "Número de factura:"
        // doc.setTextColor(22, 78, 99); // Color azul oscuro
        // doc.setFont('normal'); // Texto normal
        // doc.text('Número de factura:', datosX, datosY + 30); // Añadir separación entre líneas
        // doc.setTextColor(0); // Restaurar color de texto a negro
        // doc.setFont('bold'); // Texto en negrita
        // doc.text(`${compra2Print.num_bill}`, datosX + 40, datosY + 30);

        // Cambiar el color del texto y las líneas
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setDrawColor(22, 78, 99); // Color azul oscuro

        // Dibujar la línea superior
        doc.line(19, 120, 189, 120);

        // Definir las posiciones del texto y dibujar las líneas
        doc.setFont('bold'); // Texto en negrita
        doc.setFontSize(15);
        const yPosition = 130; // Nueva posición en y
        doc.text('Producto', 20, yPosition);
        doc.text('Talla', 80, yPosition);
        doc.text('Cantidad', 100, yPosition);
        doc.text('Precio', 128, yPosition);
        doc.text('Importe', 170, yPosition);

        doc.line(19, yPosition + 5, 189, yPosition + 5);

        // Restaurar el color del texto a negro y el color de la línea a gris por defecto
        doc.setTextColor(0);
        doc.setDrawColor(169, 169, 169);

        return doc;
    }

    private lineaFactura(doc: any, purchaseDetail: IPurchaseDetail, linea: number): void {
        doc.setFontSize(10);
        doc.setTextColor(22, 78, 99); // Color azul oscuro para el nombre del producto
        doc.text(purchaseDetail.product.name, 20, linea - 10); // Ajustar hacia arriba

        doc.setFontSize(10);
        doc.text(purchaseDetail.product.size + '', 85, linea - 10, { align: 'right' });
        doc.text(Math.floor(purchaseDetail.amount).toString(), 103, linea - 10, { align: 'right' });
        doc.text(this.sp(purchaseDetail.product.price) + '€', 138, linea - 10, { align: 'right' });
        doc.text(this.sp(purchaseDetail.amount * purchaseDetail.product.price) + '€', 181, linea - 10, { align: 'right' });
    }

    endFactura(doc: any, linea: number, totalFactura: number, compra2Print: IPurchase): void {
        doc.setFontSize(12); // Mantener el tamaño del texto para el total
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setDrawColor(22, 78, 99); // Cambiar el color de la línea
        doc.line(19, linea - 10, 189, linea - 10); // Línea horizontal

        // Posiciones x de los textos
        const xtit = 165;
        const xnum = 185;

        doc.text('Total: ', xtit, linea - 4, { align: 'right' }); // Ajustar hacia arriba
        doc.setFontSize(14); // Mantener el tamaño del texto para el total
        doc.text(this.sp(totalFactura) + '€', xnum, linea - 4, { align: 'right' }); // Ajustar hacia arriba

        // Añadir la imagen de la firma
        const imgData = '/assets/firma.png';

        const imgWidth = 85; // Ajustar el ancho de la imagen según sea necesario
        const imgHeight = 30; // Ajustar la altura de la imagen según sea necesario
        const imgX = 103; // Posición x de la imagen
        const imgY = linea + 5; // Posición y de la imagen

        doc.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);

        // Añadir la imagen de la firma
        const imgData2 = '/assets/footer.png';

        const imgWidth2 = 210; // Ajustar el ancho de la imagen según sea necesario
        const imgHeight2 = 80; // Ajustar la altura de la imagen según sea necesario
        const imgX2 = 0; // Posición x de la imagen
        const imgY2 = linea + 41; // Posición y de la imagen

        doc.addImage(imgData2, 'PNG', imgX2, imgY2, imgWidth2, imgHeight2);
    }
}