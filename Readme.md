# Documentação da API Backend

## Sistema de Gerenciamento Clínica Infantil

Este repositório contém a API backend para um sistema de gerenciamento clínica infantil, desenvolvido em Laravel. Esta API é responsável por gerenciar dados de pacientes, funcionários, consultas, pagamentos, prontuários e fornecer estatísticas, tudo de forma segura através de autenticação.

---

## 🚀 Tecnologias Utilizadas

**Framework**: Laravel

**Autenticação**: Laravel Sanctum

**Banco de Dados**: MySQL

---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para configurar o projeto em sua máquina local.

Clone o repositório:

```
git clone https://github.com/RonaldMamani/ClinicaInfa.git
cd clinica-infantil-backend
```

Instale as dependências do Composer:

```
composer install
```

Crie o arquivo de ambiente e configure-o:
Crie uma cópia do arquivo .env.example e renomeie para .env.

```
cp .env.example .env
```

Em seguida, configure as credenciais do seu banco de dados MySQL e outras variáveis de ambiente no arquivo .env.

Gere a chave da aplicação:

```
php artisan key:generate
```

Execute o servidor de desenvolvimento do Laravel:

```
php artisan serve
```

O servidor estará disponível em http://localhost:8000.

## 🔒 Autenticação

A API utiliza o Laravel Sanctum para gerenciar a autenticação de usuários via tokens. Todas as rotas que não são de login exigem um token de portador (Bearer Token) no cabeçalho da requisição para serem acessadas.

Endpoints de Autenticação:

* POST /api/login - Autentica um usuário e retorna um token de acesso.

* POST /api/logout - Revoga o token de acesso do usuário autenticado.

## 🗺️ Rotas da API

Abaixo estão listados os endpoints da API, agrupados por funcionalidade. Todas as rotas, exceto a de login, requerem autenticação.

### Clientes

* GET /api/clientes - Lista todos os clientes.

* GET /api/clientes/{id} - Exibe um cliente específico.

* POST /api/clientes - Cria um novo cliente.

### Consultas

* GET /api/consultas - Lista todas as consultas.

* GET /api/consultas/listar - Lista consultas de forma detalhada.

* GET /api/consultas/agendadas - Lista consultas agendadas.

* GET /api/consultas/listar-agendadas - Lista consultas agendadas de forma detalhada.

* GET /api/consultas/agendadas/{id} - Exibe uma consulta agendada específica.

* GET /api/consultas/medico - Lista consultas do médico autenticado.

* GET /api/consultas/medico/agendados - Lista consultas agendadas do médico autenticado.

* GET /api/consultas/quantidades/todas - Retorna a quantidade total de consultas.

* GET /api/consultas/quantidades/agendadas - Retorna a quantidade de consultas agendadas.

* GET /api/consultas/estatisticas - Retorna todas as estatísticas relacionadas a consultas.

* GET /api/consultas/medico/count/total - Retorna a contagem total de consultas de um médico.

* GET /api/consultas/medico/count/agendadas - Retorna a contagem de consultas agendadas de um médico.

* GET /api/consultas/{id} - Exibe uma consulta específica.

* POST /api/consultas - Cria uma nova consulta.

* POST /api/consultas/medico/agendar - Agenda uma consulta para um médico.

* POST /api/consultas/{id}/finalizar - Finaliza uma consulta.

* PUT /api/consultas/{id} - Atualiza uma consulta existente.

* PUT /api/consultas/agendadas/{id}/remarcar - Remarca uma consulta agendada.

* PUT /api/consultas/{id}/concluir - Conclui uma consulta.

* PATCH /api/consultas/{id}/status - Atualiza o status de uma consulta.

### Funcionários

* GET /api/funcionarios - Lista todos os funcionários.

* GET /api/funcionarios/{id} - Exibe um funcionário específico.

### Médicos

* GET /api/medicos - Lista todos os médicos.

* GET /api/medicos/{id} - Exibe um médico específico.

* POST /api/medicos - Cria um novo médico.

### Pacientes

* GET /api/pacientes - Lista todos os pacientes.

* GET /api/pacientes/contagem - Conta o número total de pacientes.

* GET /api/pacientes/paginacao - Lista pacientes com paginação.

* GET /api/pacientes/ativos - Lista pacientes ativos.

* GET /api/pacientes/inativos - Lista pacientes inativos.

* GET /api/pacientes/{id} - Exibe um paciente específico.

* POST /api/pacientes - Cria um novo paciente.

* PUT /api/pacientes/{id} - Atualiza um paciente existente.

* DELETE /api/pacientes/{id} - Inativa o Paciente e deixa o cliente em inativo.

### Pagamentos

* GET /api/pagamentos - Lista todos os pagamentos.

* GET /api/pagamentos/{pagamento} - Exibe um pagamento específico.

* POST /api/pagamentos - Cria um novo pagamento.

* PUT /api/pagamentos/{pagamento} - Atualiza um pagamento existente.

* DELETE /api/pagamentos/{pagamento} - Deleta um pagamento.

### Perfis

* GET /api/perfis - Lista todos os perfis.

* GET /api/perfis/{perfil} - Exibe um perfil específico.

### Prontuários

* GET /api/prontuarios - Lista todos os prontuários.

* GET /api/prontuarios/paciente/{idPaciente}/check - Verifica a existência de um prontuário para um paciente.

* GET /api/prontuarios/paciente/{idPaciente} - Exibe o prontuário de um paciente específico.

* GET /api/prontuarios/{prontuario} - Exibe um prontuário específico.

* POST /api/prontuarios - Cria um novo prontuário.

* PUT /api/prontuarios/{prontuario} - Atualiza um prontuário existente.

* PATCH /api/prontuarios/{prontuario} - Atualiza um prontuário existente.

* DELETE /api/prontuarios/{prontuario} - Deleta um prontuário.

### Responsáveis

* GET /api/responsaveis - Lista todos os responsáveis.

* GET /api/responsaveis/listar - Lista responsáveis de forma detalhada.

* GET /api/responsaveis/ativos - Lista responsáveis ativos.

* GET /api/responsaveis/inativos - Lista responsáveis inativos.

* GET /api/responsaveis/page-ativos - Lista responsáveis ativos com paginação.

* GET /api/responsaveis/page-inativos - Lista responsáveis inativos com paginação.

* GET /api/responsaveis/{id} - Exibe um responsável específico.

* PUT /api/responsaveis/{id}/status - Atualiza o status de um responsável.

* PUT /api/responsaveis/{id} - Atualiza um responsável existente.

* PATCH /api/responsaveis/{id} - Atualiza um responsável existente.

### Usuários

* GET /api/usuarios - Lista todos os usuários.

* GET /api/usuarios/todos - Lista todos os usuários.

* GET /api/usuarios/ativos - Lista usuários ativos.

* GET /api/usuarios/inativos - Lista usuários inativos.

* GET /api/usuarios/{id} - Exibe um usuário específico.

* POST /api/usuarios - Cria um novo usuário.

* PUT /api/usuarios/{id} - Atualiza um usuário existente.

* PUT /api/usuarios/{id}/activate - Reativa um usuário inativo.

* PUT /api/usuarios/{id}/redefinir - Redefine a senha de um usuário.

* PATCH /api/usuarios/{id} - Atualiza um usuário existente.

* DELETE /api/usuarios/{id} - Inativa um usuário (delete lógico) ao invés de removê-lo fisicamente

### Estados

* GET /api/estados - Lista todos os estados.

* GET /api/estados/{estado} - Exibe um estado específico.

### Cidades

* GET /api/cidades - Lista todas as cidades.

* GET /api/estados/{estadoId}/cidades - Lista todas as cidades de um estado específico.

### Gêneros

* GET /api/generos - Lista todos os gêneros.

* GET /api/generos/get - Retorna a lista de gêneros.

* GET /api/generos/{genero} - Exibe um gênero específico.

### Estatísticas

* GET /api/estatisticas/pacientes-por-cidade - Retorna a contagem de pacientes por cidade.

* GET /api/estatisticas/responsaveis-por-cidade - Retorna a contagem de responsáveis por cidade.

* GET /api/estatisticas/receita-mensal - Retorna a receita mensal.

* GET /api/estatisticas/consultas-por-especialidade - Retorna a contagem de consultas por especialidade.

* GET /api/estatisticas/pacientes-por-genero - Retorna a contagem de pacientes por gênero.

* GET /api/estatisticas/clientes-por-funcao - Retorna a contagem de clientes por função.

* GET /api/estatisticas/consultas-por-medico-por-mes - Retorna a contagem de consultas de um médico por mês.

* GET /api/estatisticas/consultas-e-pacientes-mensal - Retorna a contagem de consultas e a atividade de pacientes mensais.


# Documentação do Frontend

## Sistema de Gerenciamento Clínico

Este projeto de frontend para um sistema de gerenciamento para clinicas infantil, desenvolvido com Angular e estilizado com Bootstrap. A aplicação oferece uma interface dinâmica para três perfis de usuário diferentes: Administrador, Médico e Secretária.

## 🚀 Tecnologias Utilizadas

**Framework**: Angular

**Estilização**: Bootstrap

**Linguagem**: TypeScript

**Gerenciamento de Pacotes**: npm

**Biblioteca de Estatistica**: ChartsJS

## ⚙️ Instalação e Configuração

Para rodar o projeto localmente, siga os passos abaixo:

Clone o repositório:

```
git clone https://github.com/RonaldMamani/ClinicaInfa.git
cd clinica-infantil-front-end
```

Instale as dependências:

```
npm install
```

*Certifique-se de que o backend está rodando:
A aplicação frontend se conecta a um backend Laravel. Antes de iniciar, certifique-se de que o servidor backend está ativo em http://localhost:8000.*

Execute o servidor de desenvolvimento do Angular:

```
ng serve
```

O servidor estará disponível em http://localhost:4200 por padrão.

## 🔒 Autenticação e Autorização

A autenticação é gerenciada pelo AuthService e a autorização (proteção de rotas) pelo authGuard.

Login: Ao fazer login, o AuthService envia as credenciais para o backend. Em caso de sucesso, ele armazena o token de acesso (access_token), o perfil do usuário (user_profile) e o nome do usuário (user_name) no localStorage.

Proteção de Rotas: O authGuard verifica se o usuário está logado e se o perfil dele (user_profile) é o esperado para a rota acessada. Se o perfil não for compatível, o usuário é redirecionado para a página principal do seu perfil para evitar acesso indevido.

Logout: O logout() revoga o token no backend e limpa todos os dados de autenticação do localStorage, redirecionando o usuário para a tela de login.

## 🗺️ Estrutura de Rotas

O sistema de rotas é dividido em áreas protegidas, cada uma com um dashboard principal para um perfil específico. A navegação é modular, com rotas filhas (children) que organizam as funcionalidades.

Rotas Públicas
path: 'login' - Tela de login.

Rotas Protegidas (Requrem autenticação)
path: 'dashboard' - Dashboard principal (redireciona para o dashboard do perfil logado).


## 👤 Funcionalidades Por perfil

### 👩‍💻 Secretaria

O perfil de secretária é responsável pela gestão e agendamento de consultas, bem como pelo gerenciamento do cadastro de pacientes e clientes. As principais funcionalidades incluem:

#### Gestão de Pacientes:

* Visualizar uma lista completa de todos os pacientes cadastrados.

* Adicionar novos clientes e pacientes ao sistema.

* Visualizar e editar os detalhes de um paciente específico.

* Adicionar informações de um responsável para o paciente, se necessário.

#### Gestão de Consultas:

* Agendar novas consultas para os pacientes.

* Visualizar a lista de todas as consultas no sistema.

* Acessar a lista de consultas agendadas, que estão pendentes de realização.

* Remarcar ou cancelar consultas agendadas.

* Finalizar o registro de uma consulta que foi concluída.

* Visualizar e editar os detalhes de qualquer consulta existente.

### 🥼 Medico

O perfil de médico tem foco na gestão de suas próprias consultas e prontuários, permitindo uma visão completa de sua agenda e histórico de atendimentos. As principais funcionalidades incluem:

#### Minhas Consultas:

* Visualizar o histórico completo de todas as suas consultas.

* Acessar a lista de suas próximas consultas agendadas.

* Remarcar ou atender uma consulta agendada.

* Criar novas consultas, se necessário.

#### Prontuários:

* Visualizar uma lista de todos os prontuários que você criou ou atendeu.

* Acessar os detalhes de um prontuário específico para revisão.

### 🧑‍💼 Administrador

O perfil de administrador tem uma visão gerencial e de controle total sobre o sistema, permitindo o gerenciamento de todos os dados e usuários, além de acesso a métricas e relatórios. As principais funcionalidades incluem:

#### Gestão de Funcionários:

* Visualizar, adicionar, editar e gerenciar todos os funcionários (incluindo médicos e secretárias).

#### Gestão de Dados Gerais:

* Visualizar e gerenciar listas completas de pacientes, responsáveis e consultas.

* Adicionar, editar, remarcar ou finalizar consultas.

* Adicionar e editar dados de pacientes e responsáveis.

#### Gestão Financeira:

* Visualizar a lista de todos os pagamentos.

* Editar detalhes de pagamentos específicos.

#### Análise e Relatórios:

* Acessar a área de estatísticas para visualizar relatórios e métricas do sistema.