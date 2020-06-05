# Code Review Notes

Primeiramente parabéns! Sei que saísse bastante da zona de conforto, e fosse pra totalmente outra stack.

Rodei aqui na minha máquina deu tudo certo, senti a falta de um README. Pra explicar sobre o projeto,
documentar como se roda, porque as coisas foram feitas de um jeito, não de outro...

A estrutura do projeto ficou boa, ficou bem separadinho, nada mega-complexo também porque é um projeto simples.

Uma desvantagem de ter feito do jeito que foi feito para pegar os planetas é que a response time de uma query acaba ficando muito demorada.
Poderia ter explorado, ou pelo menos documentado que pensou nessas outras opções, fazer um job que pega os planetas antes, e popula o DB.
O que melhoraria bastante a response time, mas também daí poderia introduzir problemas de cache(e se o dado estiver desatualizado?)

Sobre o schema do GraphQL
- hasStation deveria ser not-null, pois é uma informação sim/não(fica estranho receber um null)
- mass deveria ser um número pelo desafio

```json
{
  "name": "11 Com b",
  "mass": {
    "value": 19.4,
    "unit": "M_jup"
  },
  "hasStation": null
}
```

Senti que faltou tipagem em alguns lugares, tinha vários `any` no projeto e poderia se atentar mais a deixar mais _type-safe_.

Mas em linhas gerais foi uma boa solução, e os pontos que poderiam melhorar em linhas gerais:

- documentação
- conhecimento das libs/ferramentas(JS, TS, GraphQL)

---

Fora esse arquivo `NOTES.md` tem vários comentários pelo projeto sobre como o código poderia ficar mais enxuto.
