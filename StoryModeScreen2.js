import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Dimensions, ImageBackground, Image } from 'react-native';

const LARGURA_TELA = Dimensions.get('window').width;

// Links convertidos para exibição direta no React Native
const IMG_FUNDO_GRAMA = 'https://i.postimg.cc/hGWR8JfT/Caminho-gramado.png';
const IMG_BOLINHA = 'https://i.postimg.cc/zGR1RwXg/Bolinha.png';
const IMG_MONSTRO_VERMELHO = 'https://i.postimg.cc/rp1Xf8rY/quadrado-vermelho-divisao.png';
const IMG_CACHORRINHO = 'https://i.postimg.cc/sgZRZPDS/cachorrosemfundo.png';

export default function StoryModeScreen2({ navigation }) {
  // Etapas do fluxo do jogo:
  // 1: Bolinha entra e para
  // 1.5: Subconsciente avisa sobre o novo monstro
  // 2: Monstro 1 aparece -> Batalha Multiplicação
  // 3: Cachorrinho aparece -> Decisão Acariciar
  // 3.5: Escolheu "Não" -> Subconsciente fala e cachorro vai embora sem dar vida
  // 4: Diálogo Cão (Parte 1)
  // 5: Diálogo Cão (Parte 2)
  // 6: Cachorrinho some e dropa o Coração
  // 7: Diálogo Subconsciente sobre a vida extra
  // 8: Monstro 2 aparece -> Batalha Divisão por 5 (Sem finais 0 ou 5)
  // 9: Monstro 3 aparece -> Batalha Divisão por 5
  // 10: Monstro 4 aparece -> Batalha Divisão por 5
  // 11: Monstro 5 aparece -> Batalha Divisão por 5
  // 12: Vitória Final!
  const [etapa, setEtapa] = useState(1);
  
  const [vidas, setVidas] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackErro, setFeedbackErro] = useState('');

  // Perguntas Matemáticas Atuais
  const [perguntaAtual, setPerguntaAtual] = useState({ questao: '', resposta: 0, opcoes: [] });

  // Controles de Animação
  const posicaoBolinha = useRef(new Animated.Value(-180)).current; 
  const posicaoInimigo = useRef(new Animated.Value(LARGURA_TELA + 180)).current; 
  const opacidadeInimigo = useRef(new Animated.Value(1)).current;
  const animacaoCoracao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    iniciarFase2();
  }, []);

  const iniciarFase2 = () => {
    setEtapa(1);
    setVidas(2);
    setGameOver(false);
    setFeedbackErro('');
    posicaoBolinha.setValue(-180);
    posicaoInimigo.setValue(LARGURA_TELA + 180);
    opacidadeInimigo.setValue(1);
    animacaoCoracao.setValue(0);

    // Bolinha entra pela esquerda e para
    Animated.timing(posicaoBolinha, {
      toValue: 40,
      duration: 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      setEtapa(1.5);
    });
  };

  const proximaEtapa = (proxima) => {
    setEtapa(proxima);
    setFeedbackErro('');

    if (proxima === 2) {
      gerarPerguntaMultiplicacao();
      animarEntradaInimigo();
    } else if (proxima === 3) {
      animarEntradaInimigo();
    } else if (proxima === 8) {
      gerarPerguntaDivisaoDificil();
      animarEntradaInimigo();
    } else if (proxima === 9) {
      gerarPerguntaDivisaoDificil();
      animarEntradaInimigo();
    } else if (proxima === 10) {
      gerarPerguntaDivisaoDificil();
      animarEntradaInimigo();
    } else if (proxima === 11) {
      gerarPerguntaDivisaoDificil();
      animarEntradaInimigo();
    }
  };

  // --- ANIMAÇÕES ---
  const animarEntradaInimigo = () => {
    posicaoInimigo.setValue(LARGURA_TELA + 180);
    opacidadeInimigo.setValue(1);
    Animated.timing(posicaoInimigo, {
      toValue: LARGURA_TELA - 260, // Posição ideal para o tamanho de 135px
      duration: 1800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const animarMorteInimigo = (callback) => {
    Animated.timing(opacidadeInimigo, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      posicaoInimigo.setValue(LARGURA_TELA + 180);
      if (callback) callback();
    });
  };

  const animarCachorrinhoSurgirCoracao = () => {
    Animated.timing(opacidadeInimigo, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      posicaoInimigo.setValue(LARGURA_TELA + 260);
      setEtapa(6);
      Animated.timing(animacaoCoracao, {
        toValue: 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  };

  // Cachorrinho vai embora sem dar coração (quando escolhe "Não")
  const animarCachorrinhoIrEmbora = () => {
    Animated.timing(opacidadeInimigo, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start(() => {
      posicaoInimigo.setValue(LARGURA_TELA + 180);
      proximaEtapa(8); // Segue para os monstros de divisão sem vida extra
    });
  };

  const coletarCoracao = () => {
    setVidas(3);
    setEtapa(7);
  };

  // --- GERAÇÃO DE PERGUNTAS ALEATÓRIAS ---
  const embaralhar = (array) => array.sort(() => Math.random() - 0.5);

  const gerarPerguntaMultiplicacao = () => {
    const dezenas = [12, 13, 14, 21, 22, 23, 31, 32];
    const multiplicadores = [2, 3, 4];
    const n1 = dezenas[Math.floor(Math.random() * dezenas.length)];
    const n2 = multiplicadores[Math.floor(Math.random() * multiplicadores.length)];
    const resposta = n1 * n2;
    
    const opcoes = embaralhar([resposta, resposta + 4, resposta - 10]);
    setPerguntaAtual({
      questao: `Quanto é ${n1} x ${n2}?`,
      resposta: resposta,
      opcoes: opcoes
    });
  };

  const gerarPerguntaDivisaoDificil = () => {
    let n1;
    do {
      n1 = Math.floor(Math.random() * (450 - 100 + 1)) + 100;
    } while (n1 % 10 === 0 || n1 % 5 === 0);

    const resposta = parseFloat((n1 / 5).toFixed(1));
    const opcaoIncorreta1 = parseFloat((resposta + 1.2).toFixed(1));
    const opcaoIncorreta2 = parseFloat((resposta - 0.8).toFixed(1));

    const opcoes = embaralhar([resposta, opcaoIncorreta1, opcaoIncorreta2]);
    setPerguntaAtual({
      questao: `Quanto é ${n1} ÷ 5?`,
      resposta: resposta,
      opcoes: opcoes
    });
  };

  // --- SISTEMA DE RESPOSTA ---
  const responder = (opcao) => {
    if (opcao === perguntaAtual.resposta) {
      setFeedbackErro('');
      animarMorteInimigo(() => {
        if (etapa === 2) {
          proximaEtapa(3); 
        } else if (etapa === 8) {
          proximaEtapa(9); 
        } else if (etapa === 9) {
          proximaEtapa(10);
        } else if (etapa === 10) {
          proximaEtapa(11);
        } else if (etapa === 11) {
          proximaEtapa(12); 
        }
      });
    } else {
      const novasVidas = vidas - 1;
      setVidas(novasVidas);
      if (novasVidas <= 0) {
        setGameOver(true);
      } else {
        setFeedbackErro('O monstro contra-atacou! Resposta errada.');
      }
    }
  };

  const estiloCoracaoAnimado = {
    bottom: animacaoCoracao.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, 35],
    }),
    opacity: animacaoCoracao,
  };

  return (
    <View style={styles.container}>
      
      {/* HUD de Vidas */}
      <View style={styles.header}>
        <Text style={styles.headerText}>❤️ Vidas: {vidas}</Text>
      </View>

      {/* ÁREA DE JOGO (CENÁRIO) */}
      <View style={styles.areaCenario}>
        <ImageBackground source={{ uri: IMG_FUNDO_GRAMA }} style={styles.areaJogo} resizeMode="cover">
          
          {/* Bolinha Estática (Sempre na esquerda) */}
          <Animated.View style={[styles.containerBolinha, { left: posicaoBolinha }]}>
            <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
          </Animated.View>

          {/* Inimigos / Cachorrinho (Surgem da direita) */}
          {(etapa === 2 || etapa === 8 || etapa === 9 || etapa === 10 || etapa === 11) && (
            <Animated.Image 
              source={{ uri: IMG_MONSTRO_VERMELHO }} 
              style={[styles.monstro, { left: posicaoInimigo, opacity: opacidadeInimigo }]}
            />
          )}

          {(etapa === 3 || etapa === 3.5 || etapa === 4 || etapa === 5) && (
            <Animated.Image 
              source={{ uri: IMG_CACHORRINHO }} 
              style={[styles.monstro, { left: posicaoInimigo, opacity: opacidadeInimigo }]}
            />
          )}

          {/* Coração Dropado */}
          {etapa === 6 && (
            <Animated.View style={[styles.coracaoDropado, { left: LARGURA_TELA - 150 }, estiloCoracaoAnimado]}>
              <Text style={{ fontSize: 35 }}>💖</Text>
            </Animated.View>
          )}

        </ImageBackground>
      </View>

      {/* ÁREA DO PAINEL DE DIÁLOGO E INTERAÇÕES */}
      <View style={styles.areaPainel}>

        {/* ETAPA 1: Bolinha Parando */}
        {etapa === 1 && (
          <View style={styles.centralizar}>
            <Text style={styles.textoCaminhando}>A Bolinha está caminhando para a escola... 🏃‍♂️</Text>
          </View>
        )}

        {/* ETAPA 1.5: Diálogo de Alerta do Subconsciente */}
        {etapa === 1.5 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>
              Cuidado, lá vem um monstro! Esse é diferente do que já vimos!
            </Text>
            <TouchableOpacity style={styles.botaoAvancar} onPress={() => proximaEtapa(2)}>
              <Text style={styles.textoBotao}>Encarar Monstro ⚔️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPAS COM MONSTROS (2, 8, 9, 10, 11) -> Caixa de Pergunta */}
        {(etapa === 2 || etapa === 8 || etapa === 9 || etapa === 10 || etapa === 11) && (
          <View style={styles.caixaPergunta}>
            {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
            <Text style={styles.perguntaMatematica}>{perguntaAtual.questao}</Text>
            {etapa !== 2 && (
              <Text style={styles.dicaSubtle}>(Dica: Dobre o número e mude a vírgula 1 casa para a esquerda! 🧠)</Text>
            )}
            <View style={styles.containerAlternativas}>
              {perguntaAtual.opcoes.map((opcao, idx) => (
                <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responder(opcao)}>
                  <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ETAPA 3: Decisão com o Cachorrinho */}
        {etapa === 3 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomePersonagem}>🐶 Cachorrinho de rua</Text>
            <Text style={styles.textoDialogo}>Um cachorrinho fofo abanou o rabo na sua direção! Você quer acariciar ele?</Text>
            <View style={styles.containerBotoesEscolha}>
              <TouchableOpacity style={[styles.botaoEscolha, { backgroundColor: '#2ed573' }]} onPress={() => proximaEtapa(4)}>
                <Text style={styles.textoBotaoOpcao}>Sim, claro! 😍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botaoEscolha, { backgroundColor: '#747d8c' }]} onPress={() => setEtapa(3.5)}>
                <Text style={styles.textoBotaoOpcao}>Não agora... 🏃‍♂️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ETAPA 3.5: Escolheu "Não" -> Diálogo de Tristeza do Subconsciente */}
        {etapa === 3.5 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>
              Ah... você deixou o cachorrinho triste... Talvez ele tivesse boas dicas para nos ajudar... Mas ok, vamos seguir em frente.
            </Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#747d8c' }]} onPress={animarCachorrinhoIrEmbora}>
              <Text style={styles.textoBotao}>Seguir em frente ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPA 4: Cachorrinho - Diálogo Parte 1 */}
        {etapa === 4 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomePersonagem}>🐶 Cachorrinho</Text>
            <Text style={styles.textoDialogo}>
              Olá! Sabia que para dividir por 5 da forma mais fácil, podemos simplesmente dobrar o número e depois dividir por 10?
            </Text>
            <TouchableOpacity style={styles.botaoAvancar} onPress={() => proximaEtapa(5)}>
              <Text style={styles.textoBotao}>Como assim? ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPA 5: Cachorrinho - Diálogo Parte 2 */}
        {etapa === 5 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomePersonagem}>🐶 Cachorrinho</Text>
            <Text style={styles.textoDialogo}>
              Exemplo: 322 ÷ 5. Primeiro, dobramos: 322 x 2 que dá 644. Daí, dividindo por 10, é só andar com a vírgula: fica 64,4! Fácil, né?
            </Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#ff4757' }]} onPress={animarCachorrinhoSurgirCoracao}>
              <Text style={styles.textoBotao}>Uau! Obrigado! ❤️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPA 6: Cachorrinho some e dropa vida */}
        {etapa === 6 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>Olha só, ele deixou uma vida de presente! Vamos pegá-la!</Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#ff4757' }]} onPress={coletarCoracao}>
              <Text style={styles.textoBotao}>Pegar Vida Extra! 💖</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPA 7: Subconsciente introduz os próximos monstros */}
        {etapa === 7 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomePersonagem, { color: '#e67e22' }]}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>
              Nossa vida subiu para 3! Mas cuidado, tem mais monstros vindo na estrada. Use o macete que o cachorrinho ensinou!
            </Text>
            <TouchableOpacity style={styles.botaoAvancar} onPress={() => proximaEtapa(8)}>
              <Text style={styles.textoBotao}>Preparar! ⚔️</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ETAPA 12: Vitória Final da Fase 2 -> Avançar para Fase 3 */}
{etapa === 12 && (
  <View style={styles.caixaDialogo}>
    <Text style={[styles.nomePersonagem, { color: '#2ed573' }]}>🧠 Subconsciente</Text>
    <Text style={styles.textoDialogo}>
      Incrível! Vencemos todos os desafios da estrada usando o truque da divisão por 5! Estamos salvos na escola! 🏫🎒
    </Text>
    <TouchableOpacity 
      style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} 
      onPress={() => navigation.navigate('StoryMode3')}
    >
      <Text style={styles.textoBotao}>Ir para a Fase 3 ➔</Text>
    </TouchableOpacity>
  </View>
)}

      </View>

      {/* TELA DE MORTE ESTILO CLÁSSICO FASE 1 */}
      {gameOver && (
        <View style={styles.telaGameOver}>
          <Text style={styles.textoCaveira}>💀</Text>
          <Text style={styles.tituloGameOver}>VOCÊ MORREU!</Text>
          <Text style={styles.subtituloGameOver}>Tente novamente para chegar à escola.</Text>
          <TouchableOpacity style={styles.botaoRecomecar} onPress={iniciarFase2}>
            <Text style={styles.textoBotaoRecomecar}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    alignItems: 'flex-end',
  },
  headerText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: 'bold',
  },
  areaCenario: {
    flex: 0.5, 
    width: '100%',
  },
  areaJogo: {
    flex: 1, 
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  containerBolinha: {
    position: 'absolute',
    bottom: -15,  
    width: 135,  // Tamanho aumentado!
    height: 135, 
  },
  bolinhaImagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  monstro: {
    position: 'absolute',
    bottom: -15, 
    width: 135,  // Tamanho aumentado!
    height: 135, 
    resizeMode: 'contain',
  },
  coracaoDropado: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaPainel: {
    flex: 0.5,
    backgroundColor: '#2f3542',
    padding: 15,
    justifyContent: 'center',
  },
  caixaDialogo: {
    backgroundColor: '#3f4453',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#747d8c',
  },
  nomePersonagem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4757',
    marginBottom: 5,
  },
  textoDialogo: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 21,
    marginBottom: 15,
  },
  botaoAvancar: {
    backgroundColor: '#2ed573',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centralizar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCaminhando: {
    color: '#ffa502',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  caixaPergunta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  perguntaMatematica: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 5,
  },
  dicaSubtle: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  containerAlternativas: {
    width: '100%',
  },
  botaoAlternativa: {
    backgroundColor: '#2f3542',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  containerBotoesEscolha: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  botaoEscolha: {
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  textoBotaoOpcao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoErro: {
    color: '#ff4757',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  // ESTILOS DA TELA DE MORTE ESTILO FASE 1
  telaGameOver: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoCaveira: {
    fontSize: 70,
    marginBottom: 10,
  },
  tituloGameOver: {
    color: '#ff4757',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtituloGameOver: {
    color: '#a4b0be',
    fontSize: 14,
    marginBottom: 35,
    textAlign: 'center',
  },
  botaoRecomecar: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff6b81',
  },
  textoBotaoRecomecar: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});