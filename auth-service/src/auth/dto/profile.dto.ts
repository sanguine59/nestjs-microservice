import { ApiProperty } from "@nestjs/swagger";

export class UserProfileData {
    
    @ApiProperty()
    username: string

    @ApiProperty()
    email: string

    @ApiProperty()
    country: string

    @ApiProperty()
    role: string
}