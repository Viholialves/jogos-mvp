// Função para formatar a data inserida para o formato 'DD/MM/AAAA'
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  document.querySelector('#dados').addEventListener('submit', function (e) {
    e.preventDefault();
  
    // Verificação rápida para garantir que os campos não estejam vazios
    const titulo = document.querySelector('#titulo').value;
    const dataLancamento = document.querySelector('#dataLancamento').value;
    const genero = document.querySelector('#genero').value;
    const valor = document.querySelector('#valor').value;
    const descricao = document.querySelector('#descricao').value;
    const banner = document.querySelector('#banner').files[0];
  
    if (!titulo || !dataLancamento || !genero || !valor || !descricao || !banner) {
      alert('Preencha todos os campos corretamente antes de cadastrar.');
      return;
    }
  
    // Campos dos dados do formulário
    const campos = [
      { label: 'Título', value: titulo },
      { label: 'Data de lançamento', value: formatDate(dataLancamento) },
      { label: 'Gênero', value: genero },
      { label: 'Valor', value: `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}` },
      { label: 'Descrição do Jogo', value: descricao },
      { label: 'Banner', value: banner }
    ];
  
    // Verificar se o container dos cards existe
    const cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) {
      console.error('O container de cards não foi encontrado.');
      return;
    }
  
    // Criação do card
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'text-center', 'd-flex', 'flex-column', 'align-items-center', 'p-3');
  
    // Inserir o banner (imagem)
    let img;
    if (campos.find(c => c.label === 'Banner').value instanceof File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const src = e.target.result;
        img = document.createElement('img');
        img.src = src;
        img.classList.add('card-img', 'mb-3');
        img.style.width = '200px';
        img.style.height = '200px';
        cardDiv.prepend(img);
      };
      reader.onerror = function (error) {
        console.error('Erro ao carregar a imagem: ', error);
      };
      reader.readAsDataURL(campos.find(c => c.label === 'Banner').value);
    }
  
    // Adicionar os demais campos ao card
    campos.forEach(campo => {
      if (campo.label !== 'Banner') {
        const div = document.createElement('div');
        div.classList.add('p-3', 'text-center');
  
        const title = document.createElement('div');
        title.classList.add('card-title', 'fw-bold');
        title.textContent = campo.label;
        div.appendChild(title);
  
        const content = document.createElement('div');
        content.classList.add('card-content');
  
        if (campo.label === 'Descrição do Jogo') {
          const descriptionText = campo.value;
          const maxLength = 200;
  
          if (descriptionText.length > maxLength) {
            content.innerHTML = `
              <div class="description" style="max-height: 100px; overflow: hidden;">${descriptionText.substring(0, maxLength)}...</div>
              <div class="read-more">Ler mais</div>
              <div class="full-description" style="display: none;">${descriptionText}</div>
            `;
            const descriptionDiv = content.querySelector('.description');
            const fullDescription = content.querySelector('.full-description');
            const readMoreLink = content.querySelector('.read-more');
  
            readMoreLink.addEventListener('click', function () {
              if (descriptionDiv.style.overflow === 'hidden') {
                descriptionDiv.style.overflow = 'auto';
                descriptionDiv.style.maxHeight = '100px';
                descriptionDiv.textContent = fullDescription.textContent;
                readMoreLink.textContent = 'Ler menos';
              } else {
                descriptionDiv.style.overflow = 'hidden';
                descriptionDiv.textContent = descriptionText.substring(0, maxLength) + '...';
                readMoreLink.textContent = 'Ler mais';
              }
            });
          } else {
            content.textContent = descriptionText;
          }
        } else {
          content.textContent = campo.value;
        }
  
        div.appendChild(content);
        cardDiv.appendChild(div);
      }
    });
  
    // Botões de Alterar e Excluir
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'justify-content-center', 'mt-3', 'gap-3');
  
    const alterarButton = document.createElement('button');
    alterarButton.classList.add('btn', 'text-white');
    alterarButton.style.backgroundColor = 'purple';
    alterarButton.textContent = 'Alterar';
    alterarButton.onmouseover = function () {
      alterarButton.style.backgroundColor = '#BA55DC';
    };
    alterarButton.onmouseout = function () {
      alterarButton.style.backgroundColor = 'purple';
    };
    alterarButton.addEventListener('click', function () {
      document.querySelector('#titulo').value = campos[0].value;
      document.querySelector('#dataLancamento').value = dataLancamento;
      document.querySelector('#genero').value = campos[2].value;
      document.querySelector('#valor').value = campos[3].value.replace('R$ ', '').replace(',', '.');
      document.querySelector('#descricao').value = campos[4].value;
      cardDiv.remove();
    });
  
    const excluirButton = document.createElement('button');
    excluirButton.classList.add('btn', 'text-white');
    excluirButton.style.backgroundColor = 'purple';
    excluirButton.textContent = 'Excluir';
    excluirButton.onmouseover = function () {
      excluirButton.style.backgroundColor = '#BA55DC';
    };
    excluirButton.onmouseout = function () {
      excluirButton.style.backgroundColor = 'purple';
    };
    excluirButton.addEventListener('click', function () {
      cardDiv.remove();
    });
  
    buttonContainer.appendChild(alterarButton);
    buttonContainer.appendChild(excluirButton);
    cardDiv.appendChild(buttonContainer);
  
    // Adicionar o card ao container
    cardsContainer.appendChild(cardDiv);
  
    // Resetar o formulário
    this.reset();
  });
  