# App de Testemunhos app-testimon

Sistema completo para coletar depoimentos de clientes, aprová-los antes de publicar, e exibi-los em **qualquer site** através de um widget.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `index.html` | Página pública onde o cliente escreve o depoimento |
| `admin.html` | Painel onde você aprova ou exclui depoimentos |
| `widget.js` | Script que qualquer site pode colar para exibir os depoimentos aprovados |
| `demo.html` | Exemplo de como o widget aparece em um site |
| `supabase-setup.sql` | Comando para criar a tabela no banco de dados |
| `config.js` | Onde você cola as chaves do seu projeto |

---

## Passo 1 — Criar o banco de dados (gratuito)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**, dê um nome e uma senha (guarde a senha).
3. Espere o projeto ser criado (leva ~1 minuto).
4. Vá em **SQL Editor** (menu lateral) → **New query**.
5. Abra o arquivo `supabase-setup.sql` deste projeto, copie tudo e cole lá.
6. Clique em **Run**. Isso cria a tabela `testimonials` e as regras de segurança.

## Passo 2 — Pegar suas chaves

1. No painel do Supabase, vá em **Project Settings** → **API**.
2. Copie:
   - **Project URL**
   - **anon public key**
3. Abra o arquivo `config.js` deste projeto e cole os dois valores:

```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "sua-chave-aqui";
```

## Passo 3 — Criar seu login de administrador

1. No Supabase, vá em **Authentication** → **Users** → **Add user**.
2. Cadastre seu e-mail e uma senha. Esse será seu login no `admin.html`.

## Passo 4 — Publicar no GitHub Pages

```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/SEU-USUARIO/app-testimon.git
git branch -M main
git push -u origin main
```

Depois, no repositório no GitHub: **Settings → Pages → Branch: main → Save**.

Em alguns minutos seu app estará em:
- Formulário para clientes: `https://SEU-USUARIO.github.io/app-testimon/`
- Painel de aprovação: `https://SEU-USUARIO.github.io/app-testimon/admin.html`

Envie o link do formulário para seus clientes, e use o link do painel (com login) para aprovar os depoimentos.

## Passo 5 — Exibir os depoimentos em qualquer site

Em qualquer página HTML (seu site, uma landing page, um blog, etc.), cole:

```html
<div id="meus-testemunhos"
     data-supabase-url="https://xxxxx.supabase.co"
     data-supabase-key="sua-chave-anon-public"
     data-limit="6"
     data-layout="grid"></div>

<script src="https://SEU-USUARIO.github.io/testimonial-app/widget.js"></script>
```

- `data-layout="grid"` → cartões lado a lado
- `data-layout="carousel"` → rolagem horizontal
- `data-limit` → quantos depoimentos mostrar

Isso funciona em WordPress (bloco HTML personalizado), Wix (elemento de código incorporado), Squarespace, ou qualquer página HTML. A chave usada aqui é a **anon public**, que é segura para expor publicamente — ela só permite ler depoimentos já aprovados e enviar novos, nada além disso (as regras de segurança do Passo 1 garantem isso).

Para redes sociais (Instagram, Facebook), que não permitem HTML embutido, a solução prática é: tirar um print do cartão do depoimento no painel/demo e publicar como imagem, já que essas plataformas não aceitam scripts externos.

## Como funciona o fluxo completo

1. Cliente acessa `index.html` e escreve o depoimento → fica **pendente**.
2. Você entra em `admin.html`, revisa e clica em **Aprovar**.
3. O widget em qualquer site que o exibe atualiza automaticamente, pois busca sempre os depoimentos aprovados mais recentes.
