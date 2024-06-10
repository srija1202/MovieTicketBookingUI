export interface JwtPayload {
    Id: string;
    Name: string;
    AccessLevel: string;
    exp: number;
    iss: string;
    aud: string;
}
