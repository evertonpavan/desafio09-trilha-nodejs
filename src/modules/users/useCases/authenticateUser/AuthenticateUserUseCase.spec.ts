import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IAuthenticateUserResponseDTO } from "./IAuthenticateUserResponseDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "Ronaldo Nazário",
            email: "camisa9@brazil.com",
            password: "fenomeno9"
        };

        await createUserUseCase.execute(user)

        const result = await authenticateUserCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("user");
        expect(result.user).toHaveProperty("id");
        expect(result.user).toHaveProperty("email");
        expect(result).toHaveProperty("token");
    });

    it("Should not be able to authenticate an nonexistent user", async () => {
        await expect(
            authenticateUserCase.execute({
                email: "false@mail.com",
                password: "false",
            })
        ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

    it("Should not be able to authenticate an incorrect password", async () => {
        const user: ICreateUserDTO = {
            name: "Ronaldo Nazário",
            email: "camisa9@brazil.com",
            password: "fenomeno9"
        };

        await createUserUseCase.execute(user)

        await expect(
            authenticateUserCase.execute({
                email: user.email,
                password: "incorrect",
            })
        ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

});