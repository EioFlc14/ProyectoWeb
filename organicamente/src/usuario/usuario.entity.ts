import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

//*****INCLUIR EL INDEX


@Entity('usuario')
export class UsuarioEntity{

    @PrimaryGeneratedColumn({
        name: 'usuario_id',
        unsigned: true,
    })
    usuarioId:number

    @Column({
        name: 'nombre',
        type: 'varchar',
        length: '50',
        nullable: false,
    })
    nombre:string

    @Column({
        name: 'apellido',
        type: 'varchar',
        length: '50',
        nullable: true,
    })
    apellido?:string

    @Column({
        name: 'username',
        type: 'varchar',
        length: '50',
        nullable: false,
    })
    username:string

    @Column({
        name: 'password',
        type: 'varchar',
        length: '50',
        nullable: false,
    })
    password:string

    @Column({
        name: 'email',
        type: 'varchar',
        length: '50',
        nullable: false,
    })
    email:string

    @Column({
        name: 'telefono',
        type: 'varchar',
        length: '20',
        nullable: false,
    })
    telefono:string

    @Column({
        name: 'direccion',
        type: 'varchar',
        length: '200',
        nullable: false,
    })
    direccion:string

    @Column({
        name: 'identificacion',
        type: 'varchar',
        length: '30',
        nullable: false,
    })
    identificacion: string

}