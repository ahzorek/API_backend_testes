#!/bin/bash
git add .

git status

echo "Continuar? (Digite 's' para continuar)"
read resposta_commit

if [ "$resposta_commit" == "s" ]; then
  echo "Mensagem commit:"
  read mensagem_commit
  
  git commit -m "$mensagem_commit"
  echo "Commit criado: $mensagem_commit"

  echo "Fazer push para o repositório remoto? (Digite 's' para continuar)"
  read resposta_push
  
  if [ "$resposta_push" == "s" ]; then
    git push
    echo "Push realizado."
  else
    echo "Sem push."
  fi
else
  echo "Commit não criado."
fi
