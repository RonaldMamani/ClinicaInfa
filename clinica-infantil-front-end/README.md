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