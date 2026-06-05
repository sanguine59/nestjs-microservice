import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterData {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(40)
    username!: string

    @ApiProperty()
    @IsEmail()
    email!: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country!: string

    @ApiProperty({
        description: 'Min 8 chars, max 40. Must include uppercase, lowercase, number, and special character.',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(40)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;':",./<>?`~\\])/, {
        message: 'password must contain uppercase, lowercase, number, and special character',
    })
    password!: string
}