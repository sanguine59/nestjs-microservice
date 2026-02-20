import { ApiProperty } from "@nestjs/swagger";

export class LoginData {
    @ApiProperty()
    email: string

    @ApiProperty()
    password: string
}