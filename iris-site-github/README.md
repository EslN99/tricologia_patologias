# Íris Centro Médico · Site

Site estático em HTML, CSS e JS. Não precisa de instalação nem de build.

## Endereços

| Arquivo | Endereço |
|---|---|
| `index.html` | `esln99.github.io/tricologia_patologias/` |
| `tricologia/index.html` | `esln99.github.io/tricologia_patologias/tricologia/` |
| `transplante/index.html` | `esln99.github.io/tricologia_patologias/transplante/` |

Os endereços antigos `index_Patologias.html` e `index_Transplante.html` redirecionam para os novos e mantêm os parâmetros de anúncio (UTM, gclid, fbclid).

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
3. A página 404 funciona tanto no endereço do GitHub quanto em domínio próprio.

## Depois de definir o domínio

1. Em `sitemap.xml`, troque `esln99.github.io/tricologia_patologias` pelo domínio.
2. Em `robots.txt`, ative a linha do Sitemap.
3. Envie o sitemap no Google Search Console.

## Antes de publicar

1. Depoimentos da página de transplante são exemplos. Troque pelos reais.
2. Links do Instagram e YouTube no rodapé estão como `[INSTAGRAM]` e `[YOUTUBE]`.

## Trocar uma foto

Substitua o arquivo em `assets/img/` mantendo o mesmo nome. Prefira WebP, até 1000 px no lado maior.
