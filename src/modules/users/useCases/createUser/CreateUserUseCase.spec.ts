import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a user", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "Ronaldo Nazário",
            email: "camisa9@brazil.com",
            password: "fenomeno9"
        });

        expect(user).toHaveProperty("id");
    });

    it("should not be able to create a user with exists email", async () => {
        await createUserUseCase.execute({
            name: "Ronaldo Nazário",
            email: "camisa9@brazil.com",
            password: "fenomeno"
        });

        await expect(
            createUserUseCase.execute({
                name: "Romário de Souza Faria",
                email: "camisa9@brazil.com",
                password: "baixinho"
            })
        ).rejects.toEqual(new CreateUserError());
    });

});