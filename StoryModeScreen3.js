import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Dimensions, ImageBackground, Image } from 'react-native';

const LARGURA_TELA = Dimensions.get('window').width;

// Imagens de fundo
const IMG_EXTERIOR_ESCOLA = 'https://i.postimg.cc/QMGZgBHf/Escola.png';
const IMG_CORREDOR = 'https://i.postimg.cc/9f5HP4rp/corredor-escola.png';
const IMG_BANHEIRO = 'https://i.postimg.cc/JhVC3yGD/Banheiro-escola.png';
const IMG_SALA_AULA = 'https://i.postimg.cc/g0VFgYhp/sala-de-aula.png';

// Personagens
const IMG_BOLINHA = 'https://i.postimg.cc/zGR1RwXg/Bolinha.png';
const IMG_MONSTRO_VERMELHO = 'https://i.postimg.cc/hGWR8JfC/quadrado-roxo-porcentagem.png';

export default function StoryModeScreen3({ navigation }) {
  const [etapa, setEtapa] = useState(1);
  const [vidas, setVidas] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [feedbackErro, setFeedbackErro] = useState('');

  const [indiceProva, setIndiceProva] = useState(0);
  const [acertosProva, setAcertosProva] = useState(0);
  const [perguntaAtual, setPerguntaAtual] = useState({ questao: '', resposta: 0, opcoes: [] });

  // Animações
  const posicaoBolinha = useRef(new Animated.Value(-180)).current; 
  const posicaoInimigo = useRef(new Animated.Value(LARGURA_TELA + 180)).current; 
  const opacidadeInimigo = useRef(new Animated.Value(1)).current;
  const animacaoLivro = useRef(new Animated.Value(0)).current;
  const opacidadeCenario = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    iniciarFase3();
  }, []);

  const iniciarFase3 = () => {
    posicaoBolinha.setValue(-180);
    setEtapa(1);
    setVidas(3);
    setGameOver(false);
    setFeedbackErro('');
    setIndiceProva(0);
    setAcertosProva(0);
    posicaoInimigo.setValue(LARGURA_TELA + 180);
    opacidadeInimigo.setValue(1);
    animacaoLivro.setValue(0);
    opacidadeCenario.setValue(1);

    animarEntradaBolinha();
  };

  const animarEntradaBolinha = () => {
    Animated.timing(posicaoBolinha, {
      toValue: 40,
      duration: 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const mudarCenario = (novaEtapa, acaoTransicao) => {
    // Garante que a bolinha suma imediatamente indo para a esquerda ANTES da transição de tela
    posicaoBolinha.setValue(-180);

    Animated.timing(opacidadeCenario, {
      toValue: 0.3,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setEtapa(novaEtapa);
      setFeedbackErro('');
      if (acaoTransicao) acaoTransicao();
      
      Animated.timing(opacidadeCenario, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        if (novaEtapa === 2 || novaEtapa === 3) {
          animarEntradaBolinha();
        }
      });
    });
  };

  const proximaEtapa = () => {
    if (etapa === 1) {
      mudarCenario(2);
    } else if (etapa === 2) {
      mudarCenario(3, () => {
        posicaoInimigo.setValue(LARGURA_TELA + 180);
        opacidadeInimigo.setValue(1);
        Animated.timing(posicaoInimigo, {
          toValue: LARGURA_TELA - 210, 
          duration: 1500,
          useNativeDriver: false,
        }).start();
      });
    } else if (etapa === 3) {
      gerarPerguntaAdicaoFase2();
      setEtapa(4);
    } else if (etapa === 6) {
      setEtapa(6.5);
    } else if (etapa === 6.5) {
      mudarCenario(7);
    } else if (etapa === 7) {
      setIndiceProva(0);
      gerarQuestaoProva(0);
      setEtapa(8);
    }
  };

  // --- GERADORES DE MATEMÁTICA ESTILO FASE 2 ---
  const embaralhar = (array) => array.sort(() => Math.random() - 0.5);

  // Lista de números desafiadores para o método de arredondamento / compensação
  const obterNumeroFase2 = () => {
    const numeros = [29, 39, 49, 18, 28, 38, 48, 17, 27, 37, 47, 72, 63, 54];
    return numeros[Math.floor(Math.random() * numeros.length)];
  };

  const gerarPerguntaAdicaoFase2 = () => {
    const n1 = Math.floor(Math.random() * 200) + 110;
    const somador = obterNumeroFase2();
    const resposta = n1 + somador;
    const opcoes = embaralhar([resposta, resposta + 10, resposta - 2]);
    setPerguntaAtual({
      questao: `Quanto é ${n1} + ${somador}?`,
      resposta: resposta,
      opcoes: opcoes
    });
  };

  const gerarPerguntaDivisaoDificil = () => {
    let n1;
    do {
      n1 = Math.floor(Math.random() * 350) + 101;
    } while (n1 % 10 === 0 || n1 % 5 === 0);

    const resposta = parseFloat((n1 / 5).toFixed(1));
    const opcoes = embaralhar([resposta, parseFloat((resposta + 1.2).toFixed(1)), parseFloat((resposta - 0.8).toFixed(1))]);
    setPerguntaAtual({
      questao: `Quanto é ${n1} ÷ 5?`,
      resposta: resposta,
      opcoes: opcoes
    });
  };

  const gerarQuestaoProva = (index) => {
    const tipo = index % 3;
    const n1 = Math.floor(Math.random() * 180) + 120;
    const valorFase2 = obterNumeroFase2();

    if (tipo === 0) {
      // Adição Dinâmica Fase 2
      const resposta = n1 + valorFase2;
      setPerguntaAtual({
        questao: `[Questão ${index + 1}/5] Quanto é ${n1} + ${valorFase2}?`,
        resposta: resposta,
        opcoes: embaralhar([resposta, resposta + 2, resposta - 10])
      });
    } else if (tipo === 1) {
      // Divisão Sem Zero
      let numDiv;
      do { numDiv = Math.floor(Math.random() * 250) + 101; } while (numDiv % 5 === 0);
      const resposta = parseFloat((numDiv / 5).toFixed(1));
      setPerguntaAtual({
        questao: `[Questão ${index + 1}/5] Quanto é ${numDiv} ÷ 5?`,
        resposta: Math.round(resposta * 10) / 10,
        opcoes: embaralhar([resposta, parseFloat((resposta + 1.6).toFixed(1)), parseFloat((resposta - 1.2).toFixed(1))])
      });
    } else {
      // Subtração Dinâmica Fase 2 (Garante que n1 seja maior que o subtraidor)
      const nSubtraendo = Math.floor(Math.random() * 100) + 150; 
      const resposta = nSubtraendo - valorFase2;
      setPerguntaAtual({
        questao: `[Questão ${index + 1}/5] Quanto é ${nSubtraendo} - ${valorFase2}?`,
        resposta: resposta,
        opcoes: embaralhar([resposta, resposta - 2, resposta + 10])
      });
    }
  };

  // --- SISTEMA DE RESPOSTAS ---
  const responderBanheiro = (opcao) => {
    if (opcao === perguntaAtual.resposta) {
      setFeedbackErro('');
      if (etapa === 4) {
        gerarPerguntaDivisaoDificil();
        setEtapa(5);
      } else if (etapa === 5) {
        Animated.timing(opacidadeInimigo, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }).start(() => {
          setEtapa(6);
          Animated.timing(animacaoLivro, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        });
      }
    } else {
      computarErro();
    }
  };

  const responderProva = (opcao) => {
    let novosAcertos = acertosProva;
    if (opcao === perguntaAtual.resposta) {
      novosAcertos = acertosProva + 1;
      setAcertosProva(novosAcertos);
      setFeedbackErro('');
    } else {
      const novasVidas = vidas - 1;
      setVidas(novasVidas);
      if (novasVidas <= 0) {
        setGameOver(true);
        return;
      }
      setFeedbackErro('Resposta errada! O professor olhou feio.');
    }

    const proximoIndice = indiceProva + 1;
    if (proximoIndice < 5) {
      setIndiceProva(proximoIndice);
      gerarQuestaoProva(proximoIndice);
    } else {
      setEtapa(9);
    }
  };

  const computarErro = () => {
    const novasVidas = vidas - 1;
    setVidas(novasVidas);
    if (novasVidas <= 0) {
      setGameOver(true);
    } else {
      setFeedbackErro('O monstro te atingiu! Resposta incorreta.');
    }
  };

  const obterCenarioUri = () => {
    if (etapa === 1) return IMG_EXTERIOR_ESCOLA;
    if (etapa === 2) return IMG_CORREDOR;
    if (etapa === 3 || etapa === 4 || etapa === 5 || etapa === 6 || etapa === 6.5) return IMG_BANHEIRO;
    return IMG_SALA_AULA;
  };

  if (etapa === 9) {
    return (
      <View style={styles.telaFinalAzul}>
        <View style={styles.caixaFinalConteudo}>
          {acertosProva === 5 ? (
            <>
              <Text style={styles.emojiFinal}>🏆</Text>
              <Text style={styles.nomeFinalSub}>🧠 Subconsciente:</Text>
              <Text style={styles.textoFinalDialogo}>"Ufa, conseguimos responder tudo e tiramos 10!"</Text>
              <View style={styles.linhaDivisora} />
              <Text style={styles.tituloFinalStatus}>🎉 PARABÉNS! 🎉</Text>
              <Text style={styles.subtituloFinalStatus}>Você terminou o jogo e conseguiu tirar a nota máxima na prova!</Text>
            </>
          ) : (
            <>
              <Text style={styles.emojiFinal}>📝</Text>
              <Text style={styles.nomeFinalSub}>🧠 Subconsciente:</Text>
              <Text style={styles.textoFinalDialogo}>"Mandamos bem na prova, erramos, mas erramos pouco!"</Text>
              <View style={styles.linhaDivisora} />
              <Text style={styles.tituloFinalStatus}>👍 MUITO BEM! 👍</Text>
              <Text style={styles.subtituloFinalStatus}>Você acertou {acertosProva} de 5 questões! Parabéns!</Text>
            </>
          )}
          <TouchableOpacity 
  style={styles.botaoReiniciarFinal} 
  onPress={() => navigation.navigate('Home')}
>
  <Text style={styles.textoBotaoFinal}>Voltar ao Menu 🏠</Text>
</TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>❤️ Vidas: {vidas}</Text>
      </View>

      <Animated.View style={[styles.areaCenario, { opacity: opacidadeCenario }]}>
        <ImageBackground source={{ uri: obterCenarioUri() }} style={styles.areaJogo} resizeMode="cover">
          
          <Animated.View style={[
            styles.containerBolinha, 
            { left: posicaoBolinha },
            (etapa > 6.5) && { opacity: 0 } 
          ]}>
            <Image source={{ uri: IMG_BOLINHA }} style={styles.bolinhaImagem} />
          </Animated.View>

          {(etapa === 3 || etapa === 4 || etapa === 5) && (
            <Animated.Image 
              source={{ uri: IMG_MONSTRO_VERMELHO }} 
              style={[styles.monstroGrande, { left: posicaoInimigo, opacity: opacidadeInimigo }]}
            />
          )}

          {(etapa === 6 || etapa === 6.5) && (
            <Animated.View style={[styles.livroDropado, { opacity: animacaoLivro }]}>
              <Text style={{ fontSize: 55 }}>📖</Text>
            </Animated.View>
          )}

        </ImageBackground>
      </Animated.View>

      <View style={styles.areaPainel}>

        {etapa === 1 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomeSubconsciente}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>Ufa! Conseguimos chegar a tempo!</Text>
            <TouchableOpacity style={styles.botaoAvancar} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Entrar na escola ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {etapa === 2 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomeSubconsciente}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>Depois dos monstros que enfrentamos, nossas mãos estão sujas! Vamos no banheiro antes que a aula comece!</Text>
            <TouchableOpacity style={styles.botaoAvancar} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Ir ao Banheiro 🧼</Text>
            </TouchableOpacity>
          </View>
        )}

        {etapa === 3 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomeSubconsciente, { color: '#ff4757' }]}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>MAS O QUE?! Até aqui dentro tem um monstro?! E ele é enorme!! Prepare-se!</Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#ff4757' }]} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Defender-se! ⚔️</Text>
            </TouchableOpacity>
          </View>
        )}

        {(etapa === 4 || etapa === 5) && (
          <View style={styles.caixaPergunta}>
            {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
            <Text style={styles.badgeMonstro}>💥 CHEFE DO BANHEIRO 💥</Text>
            <Text style={styles.perguntaMatematica}>{perguntaAtual.questao}</Text>
            <View style={styles.containerAlternativas}>
              {perguntaAtual.opcoes.map((opcao, idx) => (
                <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderBanheiro(opcao)}>
                  <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {etapa === 6 && (
          <View style={styles.caixaDialogo}>
            <Text style={[styles.nomeSubconsciente, { color: '#2ed573' }]}>🏆 NOVO MODO LIBERADO!</Text>
            <Text style={styles.textoDialogo}>Parabéns! Você acaba de liberar o modo arcade!</Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#2ed573' }]} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Continuar ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {etapa === 6.5 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomeSubconsciente}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>Caramba, estamos atrasados para a aula! Vamos correndo!!</Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#ff4757' }]} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Correr para a Sala! 🏃‍♂️</Text>
            </TouchableOpacity>
          </View>
        )}

        {etapa === 7 && (
          <View style={styles.caixaDialogo}>
            <Text style={styles.nomeSubconsciente}>🧠 Subconsciente</Text>
            <Text style={styles.textoDialogo}>Caramba, chegamos e o professor já está passando uma prova na lousa com 5 exercícios!</Text>
            <TouchableOpacity style={[styles.botaoAvancar, { backgroundColor: '#ffa502' }]} onPress={proximaEtapa}>
              <Text style={styles.textoBotao}>Pegar o Lápis ✏️</Text>
            </TouchableOpacity>
          </View>
        )}

        {etapa === 8 && (
          <View style={styles.caixaPergunta}>
            {feedbackErro !== '' && <Text style={styles.textoErro}>{feedbackErro}</Text>}
            <Text style={styles.perguntaMatematica}>{perguntaAtual.questao}</Text>
            <View style={styles.containerAlternativas}>
              {perguntaAtual.opcoes.map((opcao, idx) => (
                <TouchableOpacity key={idx} style={styles.botaoAlternativa} onPress={() => responderProva(opcao)}>
                  <Text style={styles.textoBotaoOpcao}>{opcao}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </View>

      {gameOver && (
        <View style={styles.telaGameOver}>
          <Text style={styles.textoCaveira}>💀</Text>
          <Text style={styles.tituloGameOver}>VOCÊ MORREU!</Text>
          <Text style={styles.subtituloGameOver}>Tente novamente para conseguir passar na prova.</Text>
          <TouchableOpacity style={styles.botaoRecomecar} onPress={iniciarFase3}>
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
    bottom: -35,  
    width: 115,  
    height: 115, 
    zIndex: 10,
  },
  bolinhaImagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  monstroGrande: {
    position: 'absolute',
    bottom: -35, 
    width: 170,  
    height: 170, 
    resizeMode: 'contain',
    zIndex: 5,
  },
  livroDropado: {
    position: 'absolute',
    top: '35%',
    left: '42%',
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
  nomeSubconsciente: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
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
  caixaPergunta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  badgeMonstro: {
    backgroundColor: '#ff4757',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  perguntaMatematica: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2f3542',
    marginBottom: 12,
    textAlign: 'center',
  },
  containerAlternativas: {
    width: '100%',
  },
  botaoAlternativa: {
    backgroundColor: '#2f3542',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
  telaFinalAzul: {
    flex: 1,
    backgroundColor: '#0a192f', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  caixaFinalConteudo: {
    width: '100%',
    backgroundColor: '#172a45',
    borderRadius: 16,
    padding: 25,
    borderWidth: 2,
    borderColor: '#306280',
    alignItems: 'center',
  },
  emojiFinal: {
    fontSize: 60,
    marginBottom: 15,
  },
  nomeFinalSub: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e67e22',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  textoFinalDialogo: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#cbd5e1',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  linhaDivisora: {
    width: '100%',
    height: 1,
    backgroundColor: '#306280',
    marginVertical: 15,
  },
  tituloFinalStatus: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#64ffda',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtituloFinalStatus: {
    fontSize: 15,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  botaoReiniciarFinal: {
    backgroundColor: '#64ffda',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  textoBotaoFinal: {
    color: '#0a192f',
    fontSize: 15,
    fontWeight: 'bold',
  },
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