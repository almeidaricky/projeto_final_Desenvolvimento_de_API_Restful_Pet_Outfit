
```
██████╗ ███████╗████████╗
██╔══██╗██╔════╝╚══██╔══╝
██████╔╝█████╗     ██║
██╔═══╝ ██╔══╝     ██║
██║     ███████╗   ██║
╚═╝     ╚══════╝   ╚═╝

                                     /\____/\
 ██████╗ ██╗   ██╗████████╗███████╗██╗████████╗
██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██║╚══██╔══╝
██║   ██║██║   ██║   ██║   █████╗  ██║   ██║
██║   ██║██║   ██║   ██║   ██╔══╝  ██║   ██║
╚██████╔╝╚██████╔╝   ██║   ██║     ██║   ██║
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝     ╚═╝   ╚═╝ ®
```

<h1 align="center">🐾 Pet Outfit</h1>

<p align="center">
Projeto acadêmico de API REST com Spring Boot<br>
Curso Programador de Back-end — SENAI Firjan Maracanã
</p>

```
██████╗ ███████╗████████╗
██╔══██╗██╔════╝╚══██╔══╝
██████╔╝█████╗     ██║
██╔═══╝ ██╔══╝     ██║
██║     ███████╗   ██║
╚═╝     ╚══════╝   ╚═╝

                                     /\____/\
 ██████╗ ██╗   ██╗████████╗███████╗██╗████████╗
██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██║╚══██╔══╝
██║   ██║██║   ██║   ██║   █████╗  ██║   ██║
██║   ██║██║   ██║   ██║   ██╔══╝  ██║   ██║
╚██████╔╝╚██████╔╝   ██║   ██║     ██║   ██║
 ╚═════╝  ╚═════╝    ╚═╝   ╚═╝     ╚═╝   ╚═╝ ®
```


---


📌 Projeto acadêmico — **Desenvolvimento de API Restful**  
🎓 Curso: **Programador de Back-end — Firjan SENAI Maracanã**

---

📖 Sobre o projeto
O Pet Outfit nasceu de um problema real que muitas lojas virtuais enfrentam: como organizar e gerenciar um catálogo de produtos de forma eficiente? Especificamente, imaginamos uma loja de roupas e acessórios para animais que ainda fazia tudo manualmente — sem sistema, sem controle adequado, com informações espalhadas.
A proposta foi criar uma solução profissional para isso: uma API REST completa que permitisse cadastrar, consultar, atualizar e remover produtos de forma organizada e escalável. O projeto foi desenvolvido com Spring Boot, seguindo boas práticas de arquitetura backend e integrado a um banco de dados MySQL.
Como complemento visual — e também como forma de ver a API em ação — criei uma interface web simples que consome os dados do backend e exibe o catálogo de forma interativa.

🎯 Contexto e objetivo
Este projeto foi desenvolvido como trabalho acadêmico para demonstrar o aprendizado em desenvolvimento de APIs REST. O objetivo principal era construir um backend funcional, com CRUD completo (Create, Read, Update, Delete), que pudesse ser testado tanto via ferramentas como Postman quanto através de uma interface visual.
A ideia era mostrar que consigo:

Estruturar uma aplicação backend seguindo padrões de arquitetura em camadas
Implementar operações de banco de dados com Spring Data JPA
Criar endpoints RESTful funcionais e bem organizados
Integrar frontend e backend de forma prática
Documentar e apresentar um projeto de forma profissional


🏗️ Arquitetura e estrutura
O projeto está dividido em duas partes complementares:
🔙 Backend (núcleo do projeto)
Esta é a parte principal, onde concentrei meu aprendizado e esforço. O backend foi desenvolvido do zero, com base nos conceitos estudados durante o curso e na documentação oficial do Spring.
Tecnologias utilizadas:

Java — linguagem base
Spring Boot — framework para criação da API
Spring Web — para criação dos endpoints REST
Spring Data JPA — para persistência e acesso ao banco de dados
MySQL — banco de dados relacional

Organização em camadas:
O código segue uma estrutura bem definida, separando responsabilidades:

Controller — camada de apresentação, onde ficam os endpoints da API
Service — camada de lógica de negócio, onde ficam as regras
Repository — camada de acesso aos dados, comunicação com o banco
Entity — entidades que representam as tabelas do banco

Essa separação torna o código mais organizado, testável e fácil de manter.
Por que o foco no backend?
Porque este é o objetivo central da disciplina. Foi aqui que pratiquei conceitos como injeção de dependências, mapeamento objeto-relacional (ORM), tratamento de requisições HTTP, e construção de APIs seguindo padrões REST.

🎨 Frontend (complemento visual)
O frontend foi desenvolvido como uma camada de visualização para tornar o projeto mais tangível e demonstrar a API em funcionamento real.
Tecnologias utilizadas:

HTML — estrutura das páginas
CSS — estilização e layout
JavaScript — interatividade e consumo da API

Funcionalidades implementadas:

Exibição de produtos em cards organizados
Filtro dinâmico por categoria
Busca por nome de produto
Carrinho lateral interativo
Modal de detalhes do produto
Design limpo e responsivo

O visual foi pensado para ser moderno e agradável, inspirado em lojas de moda para pets, mas sem copiar nenhum modelo específico. A ideia era criar algo que parecesse profissional, mas simples o suficiente para não desviar o foco do backend.

🤖 Transparência sobre o uso de IA
Considero importante ser honesto sobre as ferramentas utilizadas no desenvolvimento:
No backend: Todo o código foi escrito por mim, sem uso de inteligência artificial. O objetivo era aprender de verdade como estruturar uma API, entender cada camada, cada anotação, cada conceito. Consultei documentação oficial, exemplos da aula e materiais de estudo, mas o código foi construído manualmente.
No frontend: Utilizei IA como ferramenta de apoio para acelerar a criação da interface visual. Isso incluiu ajustes de layout, sugestões de estrutura HTML/CSS e implementação de algumas interações em JavaScript. No entanto, todo código gerado foi revisado, testado, compreendido e adaptado conforme necessário.
O frontend não era o foco da avaliação, e usar IA como assistente nessa parte me permitiu concentrar mais energia no backend, que é onde está o aprendizado principal.

🗄️ Banco de dados
O projeto utiliza MySQL como sistema de gerenciamento de banco de dados. Ele armazena duas principais entidades:

Produtos — incluindo nome, descrição, preço, categoria, imagem
Categorias — para organização do catálogo

A comunicação com o banco é feita através do Spring Data JPA, que abstrai as consultas SQL e permite trabalhar com objetos Java de forma mais natural.

🔗 Integração Frontend ↔ Backend
A interface web consome dados diretamente da API REST através de requisições HTTP:
javascript// Exemplo simplificado
fetch('http://localhost:8083/api/products')
  .then(response => response.json())
  .then(products => renderProducts(products));
Isso demonstra na prática como um frontend pode consumir uma API backend, conceito fundamental no desenvolvimento web moderno.

📌 Endpoints da API
A API oferece os seguintes endpoints principais:
MétodoEndpointDescriçãoGET/api/productsLista todos os produtosGET/api/products/{id}Busca um produto específicoPOST/api/productsCadastra um novo produtoPUT/api/products/{id}Atualiza um produto existenteDELETE/api/products/{id}Remove um produtoGET/api/categoriesLista todas as categorias
Todos os endpoints foram testados com Postman durante o desenvolvimento.

🚀 Como executar o projeto
Pré-requisitos

Java JDK instalado
MySQL instalado e rodando
IDE (Eclipse, IntelliJ, VS Code com extensões Java)
Navegador web moderno

Passo a passo
1. Preparar o banco de dados

Iniciar o servidor MySQL
Criar o banco de dados (pode ser criado automaticamente pelo Spring)

2. Executar o backend

Abrir o projeto pet-outfit-store na IDE
Verificar as configurações de banco no application.properties
Executar a aplicação Spring Boot
Aguardar a mensagem de inicialização
API estará disponível em: http://localhost:8083

3. Executar o frontend (opcional)

Navegar até a pasta do frontend
Abrir com Live Server (extensão do VS Code) ou similar
Acessar: http://127.0.0.1:5500

4. Testar a API

Usar Postman, Insomnia ou ferramenta similar
Testar os endpoints listados acima
Ou simplesmente navegar pela interface web


🌐 Visualização online
O frontend pode ser visualizado através do GitHub Pages (sem conexão com backend):
👉 https://almeidaricky.github.io/projeto_final_Desenvolvimento_de_API_Restful_Pet_Outfit/

Nota: A versão online é apenas demonstrativa do visual. Para ver a integração completa com o backend, é necessário executar localmente.


📚 Aprendizados e reflexões
Este projeto me permitiu colocar em prática diversos conceitos importantes:
Técnicos:

Arquitetura REST e boas práticas de API design
Mapeamento objeto-relacional com JPA
Injeção de dependências com Spring
Organização de código em camadas
Integração backend-frontend
Versionamento com Git

Profissionais:

Documentação de projetos
Planejamento de funcionalidades
Resolução de problemas técnicos
Pesquisa em documentação oficial


🔄 Próximos passos e melhorias futuras
Este projeto é uma base sólida, mas há espaço para evolução:
Backend

Implementar autenticação e autorização
Adicionar validações mais robustas
Criar testes unitários e de integração
Implementar paginação nos endpoints
Adicionar upload real de imagens
Tratamento de erros mais detalhado

Frontend

Recriar com framework moderno (React, Vue ou Angular)
Melhorar responsividade mobile
Adicionar mais interatividade
Implementar carrinho funcional com checkout
Melhorar a experiência do usuário

Infraestrutura

Deploy em ambiente cloud
Containerização com Docker
CI/CD pipeline
Documentação com Swagger


👨‍💻 Considerações finais
O Pet Outfit representa meu primeiro projeto completo de API REST, desenvolvido como trabalho acadêmico mas com atenção a boas práticas profissionais.
Mais do que entregar um trabalho, quis demonstrar que compreendi os conceitos fundamentais do desenvolvimento backend: como estruturar uma aplicação em camadas, como criar endpoints RESTful, como integrar com banco de dados, e como documentar adequadamente um projeto.
O frontend, mesmo sendo complementar, adiciona um valor prático ao permitir visualizar a API em ação de forma intuitiva.
Foi um processo de muito aprendizado, pesquisa, tentativa e erro — e estou satisfeito com o resultado final.

Desenvolvido por: Ricardo Almeida
Curso: Programador de Back-end
Instituição: Firjan SENAI Maracanã
Disciplina: Desenvolvimento de API Restful
Ano: 2026
