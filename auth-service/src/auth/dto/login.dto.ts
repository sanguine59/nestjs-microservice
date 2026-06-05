import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginData {
    @ApiProperty()
    @IsEmail()
    email!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string
}