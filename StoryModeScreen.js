import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Dimensions, ImageBackground, Image } from 'react-native';

const LARGURA_TELA = Dimensions.get('window').width;
const IMG_QUARTO = 'https://i.postimg.cc/9frw9nwJ/Quarto.png';
const IMG_BOLINHA = 'https://i.postimg.cc/zGR1RwXg/Bolinha.png';
const IMG_MONSTRO = 'https://i.postimg.cc/FKy5T9LW/quadrado-verde-soma.png';
const IMG_CORREDOR = 'https://i.postimg.cc/ZqtzP9C3/Corredor.png';
const IMG_BANHEIRO = 'https://i.postimg.cc/YSKBN4hj/Banheiro.png';
const IMG_COZINHA = 'https://i.postimg.cc/Zq8twTdH/Cozinha.png';

export default function StoryModeScreen({ navigation }) {
  const [cenarioAtual, setCenarioAtual] = useState('quarto');
  const [faseQuarto, setFaseQuarto] = useState('bocejo');
  const [faseCorredor, setFaseCorredor] = useState('escolha');
  const [faseBanheiro, setFaseBanheiro] = useState('chegou');
  const [faseCozinha, setFaseCozinha] = useState('entrou');
  const [temChave, setTemChave] = useState(false);
  const [vidas, setVidas] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackErro, setFeedbackErro] = useState('');

  // Perguntas aleatórias
  const [perguntaQuarto, setPerguntaQuarto] = useState({ n1: 12, n2: 8, resposta: 20, opcoes: [] });
  const [perguntaBanheiro1, setPerguntaBanheiro1] = useState({ n1: 28, n2: 56, n1Arredondado: 30, diferenca: 2, resposta: 84, opcoes: [] });
  const [perguntaBanheiro2, setPerguntaBanheiro2] = useState({ n1: 49, n2: 35, n1Arredondado: 50, diferenca: 1, resposta: 84, opcoes: [] });
  const [perguntaBoss1, setPerguntaBoss1] = useState({ n1: 48, n2: 26, n1Arredondado: 50, diferenca: 2, resposta: 74, opcoes: [] });
  const [perguntaBoss2, setPerguntaBoss2] = useState({ n1: 73, n2: 39, n2Arredondado: 40, diferenca: 1, resposta: 34, opcoes: [] });
  const [perguntaBoss3, setPerguntaBoss3] = useState({ n1: 37, n2: 55, n1Arredondado: 40, diferenca: 3, resposta: 92, opcoes: [] });
  const [perguntaBoss4, setPerguntaBoss4] = useState({ n1: 91, n2: 48, n2Arredondado: 50, diferenca: 2, resposta: 43, opcoes: [] });

  // Controles de animação
  const posicaoBolinha = useRef(new Animated.Value(-150)).current;
  const opacidadeMonstro = useRef(new Animated.Value(0)).current;
  const opacidadeCenario = useRef(new Animated.Value(1)).current;
  const animacaoChave = useRef(new Animated.Value(0)).current;

  const embaralhar = (array) => array.sort(() => Math.random() - 0.5);

  const gerarPerguntaQuarto = () => {
    const n1 = Math.floor(Math.random() * 11) + 10;
    const n2 = Math.floor(Math.random() * 11) + 5;
    const resposta = n1 + n2;
    const opcoes = embaralhar([resposta, resposta + 3, resposta - 2]);
    setPerguntaQuarto({ n1, n2, resposta, opcoes });
  };

  const gerarSomaArredondamento = (setPerguntaState) => {
    const dezenasProximas = [18, 19, 28, 29, 38, 39, 48, 49];
    const n1 = dezenasProximas[Math.floor(Math.random() * dezenasProximas.length)];
    const n2 = Math.floor(Math.random() * 40) + 20;
    const n1Arredondado = Math.ceil(n1 / 10) * 10;
    const diferenca = n1Arredondado - n1;
    const resposta = n1 + n2;
    const opcoes = embaralhar([resposta, resposta + diferenca, responseTratada(resposta, diferenca)]);
    setPerguntaState({ n1, n2, n1Arredondado, diferenca, resposta, opcoes });
  };

  const responseTratada = (resp, dif) => resp - dif === resp ? resp + 5 : resp - dif;

  const gerarSubtracaoArredondamento = (setPerguntaState) => {
    const n1 = Math.floor(Math.random() * 30) + 70;
    const dezenasProximas = [18, 19, 28, 29, 38, 39, 48, 49];
    const n2 = dezenasProximas[Math.floor(Math.random() * dezenasProximas.length)];
    const n2Arredondado = Math.ceil(n2 / 10) * 10;
    const diferenca = n2Arredondado - n2;
    const resposta = n1 - n2;
    const opcoes = embaralhar([resposta, resposta + diferenca, resposta - diferenca]);
    setPerguntaState({ n1, n2, n2Arredondado, diferenca, resposta, opcoes });
  };

  useEffect(() => {
    gerarPerguntaQuarto();
  }, []);

  const transicionarCenario = (novoCenario, acaoNoMeio = () => {}) => {
    Animated.timing(opacidadeCenario, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setCenarioAtual(novoCenario);
      acaoNoMeio();
      Animated.timing(opacidadeCenario, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
  };

  const fadeInMonstro = () => {
    opacidadeMonstro.setValue(0);
    Animated.timing(opacidadeMonstro, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const fadeOutMonstro = (callback) => {
    Animated.timing(opacidadeMonstro, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(callback);
  };

  const acordarBolinha = () => {
    setFaseQuarto('aviso_atrasado');
    posicaoBolinha.setValue(-120);
    Animated.timing(posicaoBolinha, {
      toValue: 40,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const animarAteOMonstro = () => {
    setFaseQuarto('andando_quarto');
    Animated.timing(posicaoBolinha, {
      toValue: LARGURA_TELA / 2 - 90,
      duration: 1800,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setFaseQuarto('aviso_monstro');
      fadeInMonstro();
    });
  };

  const derrotarMonstro = () => {
    setFaseQuarto('vitoria_monstro');
    fadeOutMonstro();
  };

  const animarSairDoQuarto = () => {
    setFaseQuarto('saindo_quarto');
    Animated.timing(posicaoBolinha, {
      toValue: LARGURA_TELA + 120,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      transicionarCenario('corredor_escolha', () => {
        setFaseCorredor('escolha');
      });
    });
  };

  const irAoBanheiro = () => {
    gerarSomaArredondamento(setPerguntaBanheiro1);
    gerarSomaArredondamento(setPerguntaBanheiro2);
    transicionarCenario('banheiro', () => {
      setFaseBanheiro('chegou');
      opacidadeMonstro.setValue(0);
      animacaoChave.setValue(0);
      posicaoBolinha.setValue(-120);
      Animated.timing(posicaoBolinha, {
        toValue: LARGURA_TELA / 2 + 10,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    });
  };

  const derrotarMonstroBanheiro = () => {
    fadeOutMonstro(() => {
      setFaseBanheiro('chave_dropada');
      Animated.timing(animacaoChave, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  };

  const voltarParaCorredorComChave = () => {
    setTemChave(true);
    Animated.timing(posicaoBolinha, {
      toValue: -150,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      transicionarCenario('corredor_escolha', () => {
        setFaseCorredor('escolha_com_chave');
      });
    });
  };

  const irParaCozinha = () => {
    gerarSomaArredondamento(setPerguntaBoss1);
    gerarSubtracaoArredondamento(setPerguntaBoss2);
    gerarSomaArredondamento(setPerguntaBoss3);
    gerarSubtracaoArredondamento(setPerguntaBoss4);
    transicionarCenario('cozinha', () => {
      setFaseCozinha('entrou');
      opacidadeMonstro.setValue(0);
      posicaoBolinha.setValue(-120);
      Animated.timing(posicaoBolinha, {
        toValue: 60,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    });
  };

  const derrotarBossCozinha = () => {
    fadeOutMonstro(() => {
      setFaseCozinha('boss_vitoria');
    });
  };

  const animarSairCorrendoEscola = () => {
    setFaseCozinha('bolinha_fugindo');
    Animated.timing(posicaoBolinha, {
      toValue: LARGURA_TELA + 150,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      reiniciarJogoCompleto();
      navigation.navigate('StoryMode2');
    });
  };

  const responderPerguntaQuarto = (opcao) => {
    if (opcao === perguntaQuarto.resposta) {
      setFeedbackErro('');
      derrotarMonstro();
    } else {
      tratarErro();
    }
  };

  const responderPerguntaBanheiro1 = (opcao) => {
    if (opcao === perguntaBanheiro1.resposta) {
      setFeedbackErro('');
      setFaseBanheiro('batalha_2');
    } else {
      tratarErro();
    }
  };

  const responderPerguntaBanheiro2 = (opcao) => {
    if (opcao === perguntaBanheiro2.resposta) {
      setFeedbackErro('');
      derrotarMonstroBanheiro();
    } else {
      tratarErro();
    }
  };

  const responderBoss1 = (opcao) => {
    if (opcao === perguntaBoss1.resposta) {
      setFeedbackErro('');
      setFaseCozinha('boss_alerta_ataque');
    } else {
      tratarErro();
    }
  };

  const responderBoss2 = (opcao) => {
    if (opcao === perguntaBoss2.resposta) {
      setFeedbackErro('');
      setFaseCozinha('boss_pergunta_3');
    } else {
      tratarErro();
    }
  };

  const responderBoss3 = (opcao) => {
    if (opcao === perguntaBoss3.resposta) {
      setFeedbackErro('');
      setFaseCozinha('boss_pergunta_4');
    } else {
      tratarErro();
    }
  };

  const responderBoss4 = (opcao) => {
    if (opcao === perguntaBoss4.resposta) {
      setFeedbackErro('');
      derrotarBossCozinha();
    } else {
      tratarErro();
    }
  };

  const tratarErro = () => {
    const novasVidas = vidas - 1;
    setVidas(novasVidas);
    if (novasVidas <= 0) {
      setGameOver(true);
    } else {
      setFeedbackErro('Resposta errada! O monstro te atacou. Tente de novo!');
    }
  };

  const reiniciarJogoCompleto = () => {
    setGameOver(false);
    setVidas(2);
    setFeedbackErro('');
    setTemChave(false);
    setFaseQuarto('bocejo');
    setFaseBanheiro('chegou');
    setFaseCozinha('entrou');
    posicaoBolinha.setValue(-120);
    opacidadeMonstro.setValue(0);
    animacaoChave.setValue(0);
    setCenarioAtual('quarto');
    gerarPerguntaQuarto();
  };

  const escolherDestino = (destino) => {
    if (destino === 'cozinha') {
      if (temChave) {
        irParaCozinha();
      } else {
        setFaseCorredor('cozinha_trancada');
      }
    } else if (destino === 'banheiro') {
      irAoBanheiro();
    }
  };

  const pegarChave = () => {
    setFaseBanheiro('vitoria_banheiro');
  };

  const estiloChaveAnimada = {
    bottom: animacaoChave.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 20],
    }),
    opacity: animacaoChave,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textoBotaoVoltar}>← Menu</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Vidas: {vidas} {temChave && '  🔑 Chave'}</Text>
      </View>

      <Animated.View style={[styles.areaAnimadaCenario, { opacity: opacidadeCenario }]}>
        {cenarioAtual === 'quarto' && (
          <ImageBackground source={{ uri: IMG_QUARTO }} style={styles.areaJogo} resizeMode="cover">
            {(faseQuarto !== 'bocejo' && faseQuarto !== 'aviso_atrasado') && (
              <Animated.Image 
                source={{ uri: IMG_MONSTRO }} 
                style={[styles.monstro, { left: LARGURA_TELA / 2 + 30, opacity: opacidadeMonstro }]}
              />
            )}
            <Animated.View style={[styles.containerBolinha, { left: posicaoBolinha }]}>
              <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
            </Animated.View>
            {faseQuarto === 'bocejo' && (
              <View style={styles.telaPretaOlhosFechados}>
                <Text style={styles.textoOlhosFechados}>...Zzz...</Text>
              </View>
            )}
          </ImageBackground>
        )}

        {cenarioAtual === 'corredor_escolha' && (
          <ImageBackground source={{ uri: IMG_CORREDOR }} style={styles.areaJogo} resizeMode="cover">
            <View style={[styles.containerBolinha, { left: LARGURA_TELA / 2 - 50 }]}>
              <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
            </View>
          </ImageBackground>
        )}

        {cenarioAtual === 'banheiro' && (
          <ImageBackground source={{ uri: IMG_BANHEIRO }} style={styles.areaJogo} resizeMode="cover">
            <Animated.View style={[styles.containerBolinha, { left: posicaoBolinha }]}>
              <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
            </Animated.View>
            {(faseBanheiro === 'aviso_monstro_banheiro' || faseBanheiro === 'batalha_1' || faseBanheiro === 'batalha_2') && (
              <Animated.Image 
                source={{ uri: IMG_MONSTRO }} 
                style={[styles.monstro, { left: 40, opacity: opacidadeMonstro }]}
              />
            )}
            {faseBanheiro === 'chave_dropada' && (
              <Animated.View style={[styles.chaveDropada, { left: 70 }, estiloChaveAnimada]}>
                <Text style={styles.textoChaveEmoji}>🔑</Text>
              </Animated.View>
            )}
          </ImageBackground>
        )}

        {cenarioAtual === 'cozinha' && (
          <ImageBackground source={{ uri: IMG_COZINHA }} style={styles.areaJogo} resizeMode="cover">
            <Animated.View style={[styles.containerBolinha, { left: posicaoBolinha }]}>
              <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
            </Animated.View>
            {(faseCozinha !== 'entrou' && faseCozinha !== 'boss_vitoria' && faseCozinha !== 'bolinha_fugindo') && (
              <Animated.Image 
                source={{ uri: IMG_MONSTRO }} 
                style={[styles.monstroBoss, { right: 20, opacity: opacidadeMonstro }]}
              />
            )}
          </ImageBackground>
        )}
      </Animated.View>

      <View style={styles.areaPainel}>
        {cenarioAtual === 'quarto' && (
          <View style={styles.containerSubPainel}>
            {faseQuarto === 'bocejo' && (
              <View style={styles.caixaDialogo}>
                <Text style={styles.nomePersonagem}>Bolinha</Text>
                <Text style={styles.textoDialogo}>*Aaaaahhhmm...* (Abrindo os olhos devagar...)</Text>
                <TouchableOpacity style={styles.botaoAvancar} onPress={acordarBolinha}>
                  <Text style={styles.textoBotao}>Acordar</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseQuarto === 'aviso_atrasado' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Eii, você acordou um pouco tarde hein! Estamos atrasados para a escola!</Text>
                <TouchableOpacity style={styles.botaoAvancar} onPress={animarAteOMonstro}>
                  <Text style={styles.textoBotao}>Levantar e Correr</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseQuarto === 'andando_quarto' && (
              <View style={styles.centralizar}>
                <Text style={styles.textoCaminhando}>A bolinha está correndo pelo quarto...</Text>
              </View>
            )}
            {faseQuarto === 'aviso_monstro' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Eii, cuidado! Tem um monstro perigoso à frente!</Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#e74c3c' }]} onPress={() => setFaseQuarto('batalha')}>
                  <Text style={styles.textoBotao}>Lutar!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseQuarto === 'batalha' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={styles.perguntaMatematica}>Quanto é {perguntaQuarto.n1} + {perguntaQuarto.n2}?</Text>
                <View style={styles.containerAlternativas}>
                  {perguntaQuarto.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderPerguntaQuarto(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseQuarto === 'vitoria_monstro' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Nossa, essa foi por pouco!</Text>
                <TouchableOpacity style={styles.botaoAvancar} onPress={animarSairDoQuarto}>
                  <Text style={styles.textoBotao}>Ir para o Corredor</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseQuarto === 'saindo_quarto' && (
              <View style={styles.centralizar}>
                <Text style={styles.textoCaminhando}>Correndo em direção à porta...</Text>
              </View>
            )}
          </View>
        )}

        {cenarioAtual === 'corredor_escolha' && (
          <View style={styles.containerSubPainel}>
            {faseCorredor === 'escolha' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Chegamos no corredor, para onde você quer ir?</Text>
                <View style={styles.containerBotoesEscolha}>
                  <TouchableOpacity style={styles.botaoEscolha} onPress={() => escolherDestino('banheiro')}>
                    <Text style={styles.textoBotaoOpcao}>Ir ao Banheiro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.botaoEscolha, { backgroundColor: '#7f8c8d' }]} onPress={() => escolherDestino('cozinha')}>
                    <Text style={styles.textoBotaoOpcao}>Cozinha (Trancada)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {faseCorredor === 'cozinha_trancada' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Ops, parece que a porta da cozinha está trancada... Precisamos achar a chave!</Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#3498db', marginTop: 10 }]} onPress={() => setFaseCorredor('ir_banheiro')}>
                  <Text style={styles.textoBotao}>Ok...</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCorredor === 'ir_banheiro' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Não temos escolha, vamos para o banheiro escovar os dentes e procurar a chave!</Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573', marginTop: 10 }]} onPress={irAoBanheiro}>
                  <Text style={styles.textoBotao}>Ir ao Banheiro</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCorredor === 'escolha_com_chave' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Voltou para o corredor! Agora temos a chave da cozinha em mãos!</Text>
                <View style={styles.containerBotoesEscolha}>
                  <TouchableOpacity style={[styles.botaoEscolha, { backgroundColor: '#2ecc71', width: '100%' }]} onPress={irParaCozinha}>
                    <Text style={styles.textoBotaoOpcao}>Abrir e Entrar na Cozinha</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {cenarioAtual === 'banheiro' && (
          <View style={styles.containerSubPainel}>
            {faseBanheiro === 'chegou' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Pronto, chegamos ao banheiro! Vamos escovar os dentes bem rápido!</Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#3498db' }]} onPress={() => setFaseBanheiro('escovando')}>
                  <Text style={styles.textoBotao}>Começar a Escovar</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'escovando' && (
              <View style={styles.caixaDialogo}>
                <Text style={styles.nomePersonagem}>Bolinha</Text>
                <Text style={[styles.textoDialogo, { fontStyle: 'italic', color: '#1dd1a1', marginBottom: 15 }]}>
                  *Shua-shua... escovando os dentes na pia...*
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={() => setFaseBanheiro('explica_1')}>
                  <Text style={styles.textoBotao}>Avançar</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'explica_1' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Quer um truque de cálculo mental? Imagine que queremos somar <Text style={{fontWeight: 'bold'}}>38 + 46</Text>.
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={() => setFaseBanheiro('explica_2')}>
                  <Text style={styles.textoBotao}>Como faz?</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'explica_2' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Primeiro, arredonde o <Text style={{fontWeight: 'bold'}}>38</Text> para <Text style={{fontWeight: 'bold'}}>40</Text> (adicionando +2).{"\n\n"}
                  Agora some fácil: <Text style={{fontWeight: 'bold'}}>40 + 46 = 86</Text>!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={() => setFaseBanheiro('explica_3')}>
                  <Text style={styles.textoBotao}>E depois?</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'explica_3' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Como usamos <Text style={{fontWeight: 'bold'}}>2</Text> "emprestado" no início, agora descontamos do resultado final:{"\n\n"}
                  <Text style={{fontWeight: 'bold'}}>86 - 2 = 84</Text>. Viu como facilita?
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#e67e22' }]} onPress={() => { setFaseBanheiro('aviso_monstro_banheiro'); fadeInMonstro(); }}>
                  <Text style={styles.textoBotao}>Legal!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'aviso_monstro_banheiro' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e74c3c' }]}>Alerta de Germes!</Text>
                <Text style={styles.textoDialogo}>
                  O Monstro da Placa Bacteriana saiu da banheira! Use o truque do arredondamento para derrotá-lo!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#e74c3c' }]} onPress={() => setFaseBanheiro('batalha_1')}>
                  <Text style={styles.textoBotao}>Lutar!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'batalha_1' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Primeiro Round! Use o truque:{"\n"}
                  <Text style={{color: '#2980b9'}}>Quanto é {perguntaBanheiro1.n1} + {perguntaBanheiro1.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBanheiro1.n1Arredondado} + {perguntaBanheiro1.n2} e depois tire {perguntaBanheiro1.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBanheiro1.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderPerguntaBanheiro1(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseBanheiro === 'batalha_2' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Último Round! Use o truque:{"\n"}
                  <Text style={{color: '#2980b9'}}>Quanto é {perguntaBanheiro2.n1} + {perguntaBanheiro2.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBanheiro2.n1Arredondado} + {perguntaBanheiro2.n2} e depois tire {perguntaBanheiro2.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBanheiro2.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderPerguntaBanheiro2(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseBanheiro === 'chave_dropada' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#f1c40f' }]}>Chave Encontrada!</Text>
                <Text style={styles.textoDialogo}>
                  Olha só! O monstro dropou uma chave brilhante! Deve ser da Cozinha!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#f1c40f' }]} onPress={pegarChave}>
                  <Text style={[styles.textoBotao, { color: '#000' }]}>Coletar Chave</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseBanheiro === 'vitoria_banheiro' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#2ed573' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Excelente! Agora que temos a chave, vamos voltar para o corredor e abrir a cozinha!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={voltarParaCorredorComChave}>
                  <Text style={styles.textoBotao}>Sair do Banheiro</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {cenarioAtual === 'cozinha' && (
          <View style={styles.containerSubPainel}>
            {faseCozinha === 'entrou' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#ff9f43' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>Ótimo, é hora de tomar café!</Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#e67e22' }]} onPress={() => { setFaseCozinha('surgimento_boss'); fadeInMonstro(); }}>
                  <Text style={styles.textoBotao}>Pegar a comida</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCozinha === 'surgimento_boss' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e74c3c' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Meu Deus! Apareceu um monstro maior que os outros agora! Vamos ter que derrotar ele!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#e74c3c' }]} onPress={() => setFaseCozinha('boss_pergunta_1')}>
                  <Text style={styles.textoBotao}>Batalhar Boss!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCozinha === 'boss_pergunta_1' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Boss Round 1! Use o truque:{"\n"}
                  <Text style={{color: '#c0392b'}}>Quanto é {perguntaBoss1.n1} + {perguntaBoss1.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBoss1.n1Arredondado} + {perguntaBoss1.n2} e tire {perguntaBoss1.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBoss1.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderBoss1(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseCozinha === 'boss_alerta_ataque' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#e74c3c' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Ele vai atacar! Para nos defender, temos que responder a questão corretamente!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#d35400' }]} onPress={() => setFaseCozinha('boss_pergunta_2')}>
                  <Text style={styles.textoBotao}>Defender!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCozinha === 'boss_pergunta_2' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Boss Round 2! Subtraia:{"\n"}
                  <Text style={{color: '#c0392b'}}>Quanto é {perguntaBoss2.n1} - {perguntaBoss2.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBoss2.n1} - {perguntaBoss2.n2Arredondado} e depois devolva {perguntaBoss2.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBoss2.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderBoss2(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseCozinha === 'boss_pergunta_3' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Boss Round 3! Use o truque:{"\n"}
                  <Text style={{color: '#c0392b'}}>Quanto é {perguntaBoss3.n1} + {perguntaBoss3.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBoss3.n1Arredondado} + {perguntaBoss3.n2} e tire {perguntaBoss3.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBoss3.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderBoss3(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseCozinha === 'boss_pergunta_4' && (
              <View style={styles.caixaPergunta}>
                {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
                <Text style={[styles.perguntaMatematica, { fontSize: 18, textAlign: 'center' }]}>
                  Boss Round 4 (Final)! Subtraia:{"\n"}
                  <Text style={{color: '#c0392b'}}>Quanto é {perguntaBoss4.n1} - {perguntaBoss4.n2}?</Text>
                </Text>
                <Text style={{fontSize: 12, color: '#7f8c8d', marginBottom: 10, textAlign: 'center'}}>
                  (Dica: Pense em {perguntaBoss4.n1} - {perguntaBoss4.n2Arredondado} e depois devolva {perguntaBoss4.diferenca})
                </Text>
                <View style={styles.containerAlternativas}>
                  {perguntaBoss4.opcoes.map((opcao, idx) => (
                    <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderBoss4(opcao)}>
                      <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {faseCozinha === 'boss_vitoria' && (
              <View style={styles.caixaDialogo}>
                <Text style={[styles.nomePersonagem, { color: '#2ed573' }]}>Subconsciente</Text>
                <Text style={styles.textoDialogo}>
                  Excelente! Corremos contra o tempo e derrotamos esse monstro... Vamos logo para a escola!
                </Text>
                <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={animarSairCorrendoEscola}>
                  <Text style={styles.textoBotao}>Correr para a Escola!</Text>
                </TouchableOpacity>
              </View>
            )}
            {faseCozinha === 'bolinha_fugindo' && (
              <View style={styles.centralizar}>
                <Text style={styles.textoCaminhando}>A Bolinha está correndo super rápido para a aula!</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {gameOver && (
        <View style={styles.telaGameOver}>
          <Text style={styles.tituloGameOver}>GAME OVER</Text>
          <Text style={styles.subtituloGameOver}>Ops, suas vidas acabaram...</Text>
          <TouchableOpacity style={styles.botaoRecomecar} onPress={reiniciarJogoCompleto}>
            <Text style={styles.textoBotaoRecomecar}>Aperte para Recomeçar o Jogo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#111',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botaoVoltar: { backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  textoBotaoVoltar: { color: '#fff', fontWeight: 'bold' },
  headerText: { color: '#ff4757', fontSize: 14, fontWeight: 'bold' },
  areaAnimadaCenario: { flex: 0.5, width: '100%' },
  areaJogo: { flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden' },
  telaPretaOlhosFechados: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  textoOlhosFechados: { color: '#fff', fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' },
  containerBolinha: { position: 'absolute', bottom: -32, width: 105, height: 105 },
  bolinhaImagem: { width: '100%', height: '100%', resizeMode: 'contain' },
  monstro: { position: 'absolute', bottom: -32, width: 110, height: 110, resizeMode: 'contain' },
  monstroBoss: { position: 'absolute', bottom: -30, width: 170, height: 170, resizeMode: 'contain' },
  chaveDropada: { position: 'absolute', width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  textoChaveEmoji: { fontSize: 24 },
  areaPainel: { flex: 0.5, backgroundColor: '#2f3542', padding: 15, justifyContent: 'center' },
  containerSubPainel: { width: '100%' },
  caixaDialogo: { backgroundColor: '#3f4453', borderRadius: 12, padding: 15, borderWidth: 2, borderColor: '#747d8c' },
  nomePersonagem: { fontSize: 16, fontWeight: 'bold', color: '#ff4757', marginBottom: 5 },
  textoDialogo: { fontSize: 16, color: '#ffffff', lineHeight: 22, marginBottom: 15 },
  botaoAvancar: { backgroundColor: '#2ed573', paddingVertical: 10, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: 20 },
  textoBotao: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  centralizar: { alignItems: 'center', justifyContent: 'center' },
  textoCaminhando: { color: '#ffa502', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  caixaPergunta: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center' },
  perguntaMatematica: { fontSize: 22, fontWeight: 'bold', color: '#2f3542', marginBottom: 15 },
  containerAlternativas: { width: '100%' },
  botaoAlternativa: { backgroundColor: '#2f3542', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  containerBotoesEscolha: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botaoEscolha: { backgroundColor: '#2ecc71', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, width: '48%', alignItems: 'center' },
  textoBotaoOpcao: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  textoErro: { color: '#ff4757', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  telaGameOver: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 999, alignItems: 'center', justifyContent: 'center', padding: 20 },
  tituloGameOver: { color: '#ff4757', fontSize: 36, fontWeight: 'bold', marginBottom: 10, textShadowColor: 'rgba(255, 71, 87, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  subtituloGameOver: { color: '#fff', fontSize: 18, marginBottom: 30, textAlign: 'center' },
  botaoRecomecar: { backgroundColor: '#e74c3c', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  textoBotaoRecomecar: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});