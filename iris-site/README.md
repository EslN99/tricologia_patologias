# Íris Centro Médico · Site

Site estático em HTML, CSS e JS. Não precisa de instalação nem de build.

## Endereços

| Arquivo | Endereço |
|---|---|
| `index.html` | `seudominio.com.br/` |
| `tricologia/index.html` | `seudominio.com.br/tricologia/` |
| `transplante/index.html` | `seudominio.com.br/transplante/` |

## Estrutura

```
index.html              página inicial (escolha do serviço)
tricologia/index.html   landing de tricologia
transplante/index.html  landing de transplante capilar
404.html                página de erro
assets/css/style.css    estilos compartilhados
assets/css/tricologia.css, transplante.css, home.css   estilos de cada página
assets/js/main.js       animações, carrosséis, menu e FAQ
assets/img/comum/       fotos usadas nas duas páginas
assets/img/tricologia/  fotos só da tricologia
assets/img/transplante/ fotos só do transplante
```

## Publicar

**Vercel ou Netlify (recomendado)**
1. Importe o repositório.
2. Framework: nenhum (Other). Pasta de saída: raiz.
3. Em Domains, adicione o domínio e siga as instruções de DNS.

**GitHub Pages**
1. Settings > Pages > Deploy from a branch > main > / (root).
2. Em Custom domain, informe o domínio. O GitHub cria o arquivo `CNAME`.
3. Use domínio próprio. No endereço `usuario.github.io/repositorio/`, a página 404 não encontra os arquivos.

## Depois de definir o domínio

1. Em `sitemap.xml`, troque `SEUDOMINIO.com.br`.
2. Em `robots.txt`, ative a linha do Sitemap.
3. Envie o sitemap no Google Search Console.

## Antes de publicar

1. Depoimentos da página de transplante são exemplos. Troque pelos reais.
2. Links do Instagram e YouTube no rodapé estão como `[INSTAGRAM]` e `[YOUTUBE]`.

## Trocar uma foto

Substitua o arquivo em `assets/img/` mantendo o mesmo nome. Prefira WebP, até 1000 px no lado maior.
