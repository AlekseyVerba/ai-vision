import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { UseGuards, UsePipes } from "@nestjs/common";

//SERVICES
import { AuthService } from './auth.service'

//MODELS
import { User } from 'src/modules/user/models/user.model'

//INPUT TYPES
import { RegistrationInput } from './inputTypes/registration.input'
import { LoginInput } from './inputTypes/login.input'
import { ResetPasswordInput } from './inputTypes/reset-password.input'
import { ConfirmNewPasswordInput } from './inputTypes/confirm-new-password.input'

//PIPES
import { ValidationPipe } from 'src/pipes/validation.pipe'

//QUERIES DATA 
import { UserAuth } from './queriesTypes/user-auth.query'
import { AuthGuard } from "src/guards/auth.guard";

//DECORATORS
import { UserProperty } from 'src/decorators/user-property.decorator'

@Resolver()
@UsePipes(new ValidationPipe())
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Query(returns => User, { description: 'Get current user' })
    @UseGuards(AuthGuard)
    async checkAuth(
        @UserProperty('uid') uid: string
    ) {
        return await this.authService.getUser(uid)
    }

    @Query(returns => UserAuth, { description: 'Log in' })
    async login(
        @Args('loginData') loginData: LoginInput
    ) {
        return await this.authService.login(loginData)
    }

    @Mutation(returns => String, { description: 'Registration user' })
    async registration(
        @Args('registrationData') registrationData: RegistrationInput
    ) {
        return await this.authService.registration(registrationData)
    }

    @Mutation(returns => UserAuth, { description: 'Confirm registration' })
    async confirmRegistrationToken(
        @Args('token', { type: () => String }) token: string
    ) {
        return await this.authService.confirmRegistrationToken(token)
    }

    @Mutation(returns => String, { description: 'Reset password' })
    async resetPassword(
        @Args('resetPasswordData') {email}: ResetPasswordInput
    ) {
        return await this.authService.resetPassword(email)
    }

    @Mutation(returns => String, { description: 'Confirm new password' })
    async confirmNewPassword(
        @Args('confirmNewPasswordData') confirmNewPasswordData: ConfirmNewPasswordInput
    ) {
        return await this.authService.confirmNewPassword(confirmNewPasswordData)
    }
}