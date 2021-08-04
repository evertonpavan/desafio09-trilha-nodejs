import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a user", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user: ICreateUserDTO = {
            name: "Ronaldo Nazário",
            email: "camisa9@brazil.com",
            password: "fenomeno9"
        };

        const result = await createUserUseCase.execute(user)

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("email");
        expect(result).toHaveProperty("password");
    });

    it("should not be able to create a user with exists email", async () => {

        const user1: ICreateUserDTO = {
            name: "Romário de Souza Faria",
            email: "camisa9@brazil.com",
            password: "baixinho"
        };

        await createUserUseCase.execute(user1)
        
        const user2: ICreateUserDTO = {
            name: "Romário de Souza Faria",
            email: "camisa9@brazil.com",
            password: "baixinho"
        };

        await expect(
            createUserUseCase.execute(user2)
        ).rejects.toEqual(new CreateUserError());
    });

});