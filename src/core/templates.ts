import type { EmailTemplate } from './config';

export const defaultTemplates: EmailTemplate[] = [
  {
    id: 'blank',
    name: 'Em Branco',
    mjml: `<mjml>
  <mj-body background-color="#f5f5f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text>Comece a editar aqui...</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    mjml: `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f0f0f0">
    <mj-section background-color="#1976d2" padding="20px">
      <mj-column>
        <mj-text color="#ffffff" font-size="24px" font-weight="bold" align="center">Minha Newsletter</mj-text>
        <mj-text color="#bbdefb" font-size="14px" align="center">Edicao #01 - Novidades da Semana</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">Destaque da Semana</mj-text>
        <mj-image src="https://via.placeholder.com/600x300/e3f2fd/1976d2?text=Imagem+Destaque" alt="destaque" padding="10px 0"></mj-image>
        <mj-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</mj-text>
        <mj-button background-color="#1976d2" border-radius="4px" href="#">Leia Mais</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="10px 20px">
      <mj-column>
        <mj-divider border-color="#e0e0e0"></mj-divider>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="10px 20px">
      <mj-column>
        <mj-text font-size="18px" font-weight="bold">Mais Noticias</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="0 20px 20px">
      <mj-column>
        <mj-text font-weight="bold">Artigo 1</mj-text>
        <mj-text>Breve descricao do artigo aqui.</mj-text>
      </mj-column>
      <mj-column>
        <mj-text font-weight="bold">Artigo 2</mj-text>
        <mj-text>Breve descricao do artigo aqui.</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#333333" padding="20px">
      <mj-column>
        <mj-text color="#ffffff" font-size="12px" align="center">Voce recebeu este email porque se inscreveu em nossa newsletter.</mj-text>
        <mj-text color="#999999" font-size="11px" align="center"><a href="#" style="color:#999999">Cancelar inscricao</a></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
  {
    id: 'promotional',
    name: 'Promocional',
    mjml: `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f5f5f5">
    <mj-section background-color="#ff5722" padding="40px 20px">
      <mj-column>
        <mj-text color="#ffffff" font-size="32px" font-weight="bold" align="center">MEGA PROMOCAO</mj-text>
        <mj-text color="#ffffff" font-size="18px" align="center">Ate 50% de desconto em todos os produtos!</mj-text>
        <mj-button background-color="#ffffff" color="#ff5722" font-size="18px" border-radius="30px" inner-padding="15px 40px" href="#">COMPRE AGORA</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-image src="https://via.placeholder.com/250x250/fff3e0/ff5722?text=Produto+1" alt="produto 1" padding="10px"></mj-image>
        <mj-text align="center" font-weight="bold">Produto 1</mj-text>
        <mj-text align="center" color="#ff5722" font-size="20px">R$ 99,90</mj-text>
      </mj-column>
      <mj-column>
        <mj-image src="https://via.placeholder.com/250x250/fff3e0/ff5722?text=Produto+2" alt="produto 2" padding="10px"></mj-image>
        <mj-text align="center" font-weight="bold">Produto 2</mj-text>
        <mj-text align="center" color="#ff5722" font-size="20px">R$ 149,90</mj-text>
      </mj-column>
      <mj-column>
        <mj-image src="https://via.placeholder.com/250x250/fff3e0/ff5722?text=Produto+3" alt="produto 3" padding="10px"></mj-image>
        <mj-text align="center" font-weight="bold">Produto 3</mj-text>
        <mj-text align="center" color="#ff5722" font-size="20px">R$ 199,90</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#333333" padding="15px">
      <mj-column>
        <mj-text color="#ffffff" font-size="12px" align="center">Oferta valida por tempo limitado.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
  {
    id: 'welcome',
    name: 'Boas-vindas',
    mjml: `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f5f5f5">
    <mj-section background-color="#4caf50" padding="40px 20px">
      <mj-column>
        <mj-text color="#ffffff" font-size="28px" font-weight="bold" align="center">Bem-vindo!</mj-text>
        <mj-text color="#c8e6c9" font-size="16px" align="center">Estamos felizes por ter voce conosco</mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="30px 20px">
      <mj-column>
        <mj-text font-size="16px">Ola, {{nome}}!</mj-text>
        <mj-text>Sua conta foi criada com sucesso. Aqui estao os proximos passos para comecar:</mj-text>
        <mj-text><b>1.</b> Complete seu perfil<br/><b>2.</b> Explore nossos recursos<br/><b>3.</b> Conecte-se com a comunidade</mj-text>
        <mj-button background-color="#4caf50" border-radius="4px" href="#">Acessar Minha Conta</mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f5f5f5" padding="20px">
      <mj-column>
        <mj-text font-size="12px" color="#999999" align="center">Precisa de ajuda? Responda este email ou acesse nosso suporte.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  },
];
