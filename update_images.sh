#!/bin/bash

dir="public/images"
json_output="public/images.json"

images=()

for file in "$dir"/*.{jpg,png,gif}; do
    # checa se o arquivo é uma imagem
    if [ -f "$file" ]; then
        # nome do arquivo
        fileName=$(basename "$file")
        # adiciona o endereço e o nome do arquivo ao array
        images+=("{\"path\": \"$file\", \"name\": \"$fileName\"}")
    fi
done

echo "[" > "$json_output"
for ((i = 0; i < ${#images[@]}; i++)); do
    echo "${images[$i]}" >> "$json_output"
    if [ $i -lt $(( ${#images[@]} - 1 )) ]; then
        echo "," >> "$json_output"
    fi
done
echo "]" >> "$json_output"

echo "JSON gerado com sucesso em $json_output"
