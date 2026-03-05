#!/bin/bash

# Variables
IMAGE_NAME="devanibal/booking-frontend"
VERSION="1.0.0"

# Colores para output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Construyendo imagen frontend...${NC}"

# Construir la imagen
docker build -t ${IMAGE_NAME}:latest .
docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION}

echo -e "${GREEN}Imagen construida: ${IMAGE_NAME}:latest y ${IMAGE_NAME}:${VERSION}${NC}"