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
    ) {

    }

    private loadImage(url: string) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        })
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
        doc.setTextColor(22, 78, 99); // Color rojo
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
        const urbanizeY = topY + 25; // Más arriba que antes
        const emailY = urbanizeY + 7; // Separación entre "Urbanize" y el correo electrónico
        const addressY = emailY + 7; // Separación entre el correo electrónico y la dirección

        doc.setFontSize(18);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('bold'); // Texto en negrita
        doc.text('Urbanize', urbanizeX, urbanizeY);

        doc.setFontSize(12);
        doc.setTextColor(22, 78, 99); // Color azul oscuro
        doc.setFont('normal'); // Texto normal
        doc.text('urbanize@gmail.com', urbanizeX, emailY);


        const clienteX = 25;
        const clienteY = 85;

        doc.setFontSize(14)
        doc.text('Cliente: ', clienteX - 10, clienteY)
        doc.setFontSize(15)
        const cliente = compra2Print?.user?.name + ' ' + compra2Print?.user.last_name1 + ' ' + `${compra2Print?.user?.username}`;
        doc.text(cliente, clienteX, clienteY + 10)
        doc.setFont('normal');
        doc.setFontSize(14)
        doc.text(compra2Print?.user?.address, clienteX, clienteY + 20)
        doc.text(compra2Print?.user?.email, clienteX, clienteY + 30)



        doc.line(15, 130, 195, 130);

        doc.text('Producto', 30, 140);
        doc.text('Talla', 80, 140);
        doc.text('Cantidad', 120, 140);
        doc.text('Precio (€)', 140, 140);
        doc.text('Importe', 175, 140);

        doc.line(15, 145, 195, 145);

        return doc;
    }

    private lineaFactura(doc: any, purchaseDetail: IPurchaseDetail, linea: number): void {

        doc.setFontSize(8);
        doc.text(purchaseDetail.product.name, 15, linea);
        // const titulo = purchaseDetail.camiseta.titulo;
        // const maxLength = 30;
        // if (titulo.length > maxLength) {
        //     const firstLine = titulo.substring(0, maxLength);
        //     const secondLine = titulo.substring(maxLength);
        //     doc.text(firstLine, 15, linea);
        //     doc.text(secondLine, 15, linea + 5);
        //     doc.text('', 15, linea + 20);
        // } else {
        //     doc.text(titulo, 15, linea);
        // }

        doc.setFontSize(12);
        doc.text(purchaseDetail.product.size + '', 90, linea, 'right');
        doc.text(this.sp(purchaseDetail.amount), 110, linea, 'right');
        doc.text(this.sp(purchaseDetail.product.price), 156, linea, 'right');
        doc.text(this.sp(purchaseDetail.amount * purchaseDetail.product.price), 194, linea, 'right');

    }

    endFactura(doc: any, linea: number, totalFactura: number, compra2Print: IPurchase): void {
        doc.setFontSize(12);
        doc.line(15, linea, 195, linea);
        let xtit = 150;
        let xnum = 190;
        doc.text('Total: ', xtit, linea + 7, 'right');
        doc.text(this.sp(totalFactura) + ' €', xnum, linea + 7, 'right');
    }

}