//Declarar Variáveis Globais
var imgTrex, trex, trexDead, edges;
var imgGround, ground;
var invGround;
var imgCloud, gClouds, cloud;
var imgCacto1 , imgCacto2,
    imgCacto3 , imgCacto4, 
    imgCacto5 , imgCacto6, gCactos, cacto;
var score = 0;    
var PLAY = 1, END = 0;
var gameState = PLAY;
var gameOver, imgGameover, 
    reiniciar,imgReiniciar;
var dieSound, pointSound, jumpSound;

//Precarregar Imagens, Animações e Sons.
function preload(){
  //Imagens:
  //Trex Imgs
  imgTrex = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexDead = loadImage("trex_dead.png")

  //Ground Img
  imgGround = loadImage("ground2.png");

  //Cloud Img
  imgCloud = loadImage("nuvem.png");

  //Cactos Imgs
  imgCacto1 = loadImage("cacto1.png");
  imgCacto2 = loadImage("cacto2.png");
  imgCacto3 = loadImage("cacto3.png");
  imgCacto4 = loadImage("cacto4.png");
  imgCacto5 = loadImage("cacto5.png");
  imgCacto6 = loadImage("cacto6.png");

  //Reset Imgs
  imgGameover = loadImage("gameOver.png");
  imgReiniciar = loadImage("reiniciar.png");

  //Sons
  dieSound = loadSound("die.mp3");
  pointSound = loadSound("checkpoint.mp3");
  jumpSound = loadSound("jump.mp3");
}

//Inicializar Variáveis (Executa só uma vez)
function setup(){
  //Criar Fundo.
  createCanvas(600,200);

  //Criar o trex.
  trex = createSprite(50,160,20,50);
  //Adiciona Animação/Imagem Ao Trex
  trex.addAnimation("running", imgTrex);
  trex.addImage("dead", trexDead);
  //Adiciona Uma escala ao trex
  trex.scale = 0.5;
  //Adiciona Hitbox ao Trex
  trex.setCollider("circle",0,0,40);
  //Exibi Hitbox do Trex
  //trex.debug = true;

  //Criar o Chão invisível.
  invGround = createSprite(200,190,400,10);
  invGround.visible = false;

  //Criar chão Visível.
  ground = createSprite(200,180,400,10);
  ground.addImage("running", imgGround);

  //Criar a Imagem de GameOver.
  gameOver = createSprite(300,70);
  gameOver.addImage(imgGameover);
  gameOver.scale = 0.7;
  gameOver.visible = false;

  //Criar Botao Reiniciar.
  reiniciar = createSprite(300,110);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.6;
  reiniciar.visible = false;

  //Criar Grupos.
  //Grupos de Cactos.
  gCactos = new Group();

  //Grupos de Nuvens
  gClouds = new Group();

  //Criar Edges(Bordas).
  edges = createEdgeSprites();
}

//Desenha na Tela e Atribui funcionalidades (Executa Várias Vezes)
function draw(){
  //Definir a cor do plano de fundo.
  background(200);

  //Criar Texto e Adicionar uma Cor.
  fill(0);
  text("Score :" + score, 510,30);

  //O que irá acontecer se o estado do Jogo
  //For igual a PLAY
  if(gameState == PLAY){
    //Calculando A Pontuação usando Frames
    score = score + Math.round(getFrameRate()/50);

    //Toca o som a cada 100 pontos
    if(score > 0  && score % 100 == 0){
      pointSound.play(); 
    }

    //Chama Função Criar Nuvens
    createClouds();

    //Dar velocidade ao chão
    ground.velocityX = -5;

    //Deixar o chão "infinito"
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    //Pular e tocar o som quando tecla de espaço for pressionada
    if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -10;
      jumpSound.play();
    } 

    //Dar Velocidade ao Trex (Gravidade)
    trex.velocityY = trex.velocityY + 0.5;

    //Chama Função Criar cactos
    createCactos();

    //Se o trex tocar nos Cactos perde o jogo e toca um som.
    if(gCactos.isTouching(trex)){
      gameState = END; 
      dieSound.play();
    }
  }

  //O que vai acontecer se o estado do jogo for igual a END
  else if(gameState == END){
    //Para o Trex e o Chão
    trex.velocityY = 0;
    ground.velocityX = 0;
    
    //Para a velocidade e a vida dos cactos
    gCactos.setVelocityXEach(0);
    gCactos.setLifetimeEach(-1);

    //Para a velocidade e a vida das Nuvens
    gClouds.setLifetimeEach(-1);
    gClouds.setVelocityXEach(0);

    //Troca a animação do Trex
    trex.changeImage("dead", trexDead);

    //Exibe o GameOver e o Reiniciar na tela
    gameOver.visible = true;
    reiniciar.visible = true;

    //Se o botao reiniciar for pressionado, chama a função Reset
    if(mousePressedOver(reiniciar)){
      reset();
    }
  }

  //impede que o trex caia
  trex.collide(invGround);

  //Desenha os Sprites na Tela
  drawSprites();
}

//Criar Funçao Gerar Nuvens
function createClouds(){
  //Se o módulo de 120 for igual a 0, cria uma nuvem
  if(frameCount % 120 == 0){
    cloud = createSprite(610,random(20,100),40,20);
    cloud.addImage(imgCloud); 
    cloud.scale = 0.7;
    cloud.velocityX = -3; 
    //Iguala a profundidade da nuvem com o Trex
    cloud.depth = trex.depth;
    //Coloca o Trex a frente da Nuvem
    trex.depth++;
    //Adiciona um tempo de vida a nuvem
    cloud.lifetime = 250;
    //Adiciona a Nuvem ao Grupo de Nuvens
    gClouds.add(cloud);
  }
}
 
//Criar Função Gerar Cactos
function createCactos(){
  if(frameCount % 120 == 0){
    cacto = createSprite(610,165,10,30);
    //Gera um numero aleatório e guarda na variavel ALT
    var alt = Math.round(random(1,6));

    //Sorteia uma das imagens dos cactos de acordo com o numero da variavel ALT
    switch(alt){
      case 1: cacto.addImage(imgCacto1);
        break;
      case 2: cacto.addImage(imgCacto2); 
        break;
      case 3: cacto.addImage(imgCacto3); 
        break;  
      case 4: cacto.addImage(imgCacto4); 
        break;
      case 5: cacto.addImage(imgCacto5); 
        break; 
      case 6: cacto.addImage(imgCacto6); 
        break; 
      default: break;  
    } 
    cacto.scale = 0.5;
    cacto.velocityX = -5; 
    cacto.lifetime = 250;
    gCactos.add(cacto);
  }
}


//Função Reset
function reset(){
  //Muda o Estado do Jogo
  gameState = PLAY;

  //Destruir Cactos e Nuvens
  gCactos.destroyEach();
  gClouds.destroyEach();

  //Resetar Pontuação
  score = 0;

  //Esconder Botões
  reiniciar.visible = false;
  gameOver.visible = false;

  //Trocar Animação
  trex.changeAnimation("running", imgTrex);

  //Resetar Posição
  trex.y = 160;
}