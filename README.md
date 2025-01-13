# NextWay Server

npx typeorm migration:generate -n DbTestMigration src/shared/infra/database/migrations/db-test src/core/db-test/infra/db-test.schema.ts

## Recuperação de senha:
Digitar email em uma página => Enviar email de recuperação com token =>
Redirecionar para uma página para digitar a nova senha e a confirmação =>
Trocar senha da conta somente se usuário possuir o token de troca de email =>
Deslogar usuário e dar opção de link para fazer login
