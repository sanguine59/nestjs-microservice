import { ApiProperty } from "@nestjs/swagger";


export class RegisterData {
    @ApiProperty()
    username: string

    @ApiProperty()
    email: string

    @ApiProperty()
    country: string

    @ApiProperty()
    password: string
}