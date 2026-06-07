// denuncia.js - Interatividade do formulário de denúncia

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('denunciaForm');
    const btnCancelar = document.querySelector('.btn-cancelar');
    const inputFile = document.getElementById('uploadImagem');
    const fileListDiv = document.getElementById('fileList');
    const mensagemDiv = document.getElementById('mensagemFeedback');
    
    let arquivosSelecionados = [];

    // Função para mostrar mensagem de feedback
    function mostrarMensagem(texto, tipo) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = 'mensagem-feedback';
        mensagemDiv.classList.add(tipo === 'sucesso' ? 'sucesso' : 'erro');
        
        // Esconde após 5 segundos
        setTimeout(() => {
            mensagemDiv.style.display = 'none';
            mensagemDiv.className = 'mensagem-feedback';
        }, 5000);
    }

    // Função para limpar o formulário
    function limparFormulario() {
        document.getElementById('nomeDenunciante').value = '';
        document.getElementById('detalhesCaso').value = '';
        document.querySelector('input[name="compartilharLocal"][value="nao"]').checked = true;
        document.getElementById('enderecoOcorrencia').value = '';
        inputFile.value = '';
        arquivosSelecionados = [];
        atualizarListaArquivos();
        
        // Remove mensagem se existir
        mensagemDiv.style.display = 'none';
        mensagemDiv.className = 'mensagem-feedback';
    }

    // Atualiza a lista visual de arquivos
    function atualizarListaArquivos() {
        fileListDiv.innerHTML = '';
        if (arquivosSelecionados.length === 0) {
            fileListDiv.style.display = 'none';
            return;
        }
        
        fileListDiv.style.display = 'flex';
        arquivosSelecionados.forEach((arquivo, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <i class="fa-regular fa-file-image"></i>
                <span>${arquivo.name.substring(0, 25)}${arquivo.name.length > 25 ? '...' : ''}</span>
                <i class="fa-solid fa-times-circle" data-index="${index}"></i>
            `;
            fileListDiv.appendChild(item);
        });
        
        // Adiciona eventos de remoção
        document.querySelectorAll('.fa-times-circle').forEach(icon => {
            icon.addEventListener('click', function(e) {
                const index = parseInt(this.getAttribute('data-index'));
                arquivosSelecionados.splice(index, 1);
                atualizarListaArquivos();
                // Atualiza o input file
                const dataTransfer = new DataTransfer();
                arquivosSelecionados.forEach(file => dataTransfer.items.add(file));
                inputFile.files = dataTransfer.files;
            });
        });
    }

    // Evento para seleção de arquivos
    inputFile.addEventListener('change', function(e) {
        const novosArquivos = Array.from(e.target.files);
        arquivosSelecionados = [...arquivosSelecionados, ...novosArquivos];
        
        // Limita a 5 arquivos
        if (arquivosSelecionados.length > 5) {
            mostrarMensagem('Máximo de 5 imagens permitidas!', 'erro');
            arquivosSelecionados = arquivosSelecionados.slice(0, 5);
        }
        
        atualizarListaArquivos();
        
        // Atualiza o input com os arquivos restantes
        const dataTransfer = new DataTransfer();
        arquivosSelecionados.forEach(file => dataTransfer.items.add(file));
        inputFile.files = dataTransfer.files;
    });

    // Evento de cancelar
    btnCancelar.addEventListener('click', function() {
        limparFormulario();
        mostrarMensagem('Formulário limpo com sucesso!', 'sucesso');
    });

    // Evento de submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validações
        const nome = document.getElementById('nomeDenunciante').value.trim();
        const detalhes = document.getElementById('detalhesCaso').value.trim();
        
        if (nome === '') {
            mostrarMensagem('Por favor, informe seu nome.', 'erro');
            document.getElementById('nomeDenunciante').focus();
            return;
        }
        
        if (detalhes === '') {
            mostrarMensagem('Por favor, descreva os detalhes do caso.', 'erro');
            document.getElementById('detalhesCaso').focus();
            return;
        }
        
        if (detalhes.length < 15) {
            mostrarMensagem('Descreva o caso com mais detalhes (mínimo 15 caracteres).', 'erro');
            document.getElementById('detalhesCaso').focus();
            return;
        }
        
        // Coleta os dados
        const compartilharLocal = document.querySelector('input[name="compartilharLocal"]:checked').value;
        const endereco = document.getElementById('enderecoOcorrencia').value.trim();
        
        // Cria objeto da denúncia
        const denuncia = {
            id: Date.now(),
            nome: nome,
            detalhes: detalhes,
            compartilharLocalizacao: compartilharLocal,
            endereco: endereco,
            data: new Date().toLocaleString('pt-BR'),
            imagens: arquivosSelecionados.map(f => f.name)
        };
        
        // Salva no localStorage (simulando envio)
        let denunciasSalvas = JSON.parse(localStorage.getItem('denuncias_arca') || '[]');
        denunciasSalvas.unshift(denuncia);
        localStorage.setItem('denuncias_arca', JSON.stringify(denunciasSalvas));
        
        // Mensagem de sucesso
        mostrarMensagem('✅ Denúncia enviada com sucesso! Agradecemos por contribuir com a causa animal.', 'sucesso');
        
        // Limpa formulário após envio
        limparFormulario();
        
        // Opcional: scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Log no console para debug
        console.log('Denúncia enviada:', denuncia);
    });
    
    // Máscara para o campo de telefone no futuro (opcional)
    // Estilização de placeholder nos browsers
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            if (!this.value) {
                mostrarMensagem('Por favor, preencha este campo.', 'erro');
            }
        });
    });
});