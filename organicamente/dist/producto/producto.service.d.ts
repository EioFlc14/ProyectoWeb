import { Repository } from "typeorm/index";
import { ProductoEntity } from "./producto.entity";
export declare class ProductoService {
    private repositorio;
    constructor(repositorio: Repository<ProductoEntity>);
    crearUno(producto: ProductoEntity): Promise<ProductoEntity>;
    buscarTodos(): Promise<ProductoEntity[]>;
    buscarUno(id: number): Promise<ProductoEntity>;
    editarUno(productoEditado: ProductoEntity): Promise<ProductoEntity>;
    eliminarUno(id: number): Promise<import("typeorm").DeleteResult>;
}
