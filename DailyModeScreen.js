import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DailyModeScreen({ navigation }) {
  const hoje = new Date().toLocaleDateString('pt-BR');

  const [estagio, setEstagio] = useState('inicio');
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  // Banco de desafios diários (indexado pelo dia do mês)
  const bancoDeDesafios = {
    1: [
      { n1: 47, n2: 38, operador: '+', resp: 85, op: [85, 83, 87] },
      { n1: 92, n2: 45, operador: '-', resp: 47, op: [43, 47, 52] },
      { n1: 29, n2: 15, operador: '+', resp: 44, op: [44, 42, 46] },
    ],
    2: [
      { n1: 50, n2: 25, operador: '+', resp: 75, op: [70, 75, 80] },
      { n1: 60, n2: 20, operador: '-', resp: 40, op: [30, 40, 50] },
      { n1: 12, n2: 5, operador: '+', resp: 17, op: [15, 17, 19] },
    ],
    // Adicione mais dias aqui conforme desejar (ex: 3, 4, 5...)
  };

  // Pega o dia atual do mês (ex: 20) e seleciona os exercícios do dia (ou usa o dia 1 como padrão se não existir)
  const diaDoMes = new Date().getDate();
  const perguntasDoDia = bancoDeDesafios[diaDoMes] || bancoDeDesafios[1];

  const iniciarDesafio = () => {
    setPerguntaAtual(0);
    setEstagio('pergunta');
  };

  const responder = (opcao) => {
    const q = perguntasDoDia[perguntaAtual];
    if (opcao === q.resp) {
      if (perguntaAtual + 1 < perguntasDoDia.length) {
        setPerguntaAtual(prev => prev + 1);
      } else {
        setEstagio('vitoria');
      }
    } else {
      setEstagio('derrota');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.textoBotaoVoltar}>← Menu</Text>
        </TouchableOpacity>
        <Text style={styles.dataTexto}>📅 Desafio de Hoje: {hoje}</Text>
      </View>

      <View style={styles.conteudo}>
        {estagio === 'inicio' && (
          <View style={styles.card}>
            <Text style={styles.titulo}>Desafio Diário 🌟</Text>
            <Text style={styles.descricao}>
              Resolva a sequência especial do dia para manter sua ofensiva! Apenas 3 questões.
            </Text>
            <TouchableOpacity style={styles.botaoIniciar} onPress={iniciarDesafio}>
              <Text style={styles.textoBotao}>Começar Desafio</Text>
            </TouchableOpacity>
          </View>
        )}

        {estagio === 'pergunta' && (
          <View style={styles.card}>
            <Text style={styles.subtitulo}>Questão {perguntaAtual + 1} de {perguntasDoDia.length}</Text>
            <Text style={styles.pergunta}>
              Quanto é {perguntasDoDia[perguntaAtual].n1} {perguntasDoDia[perguntaAtual].operador} {perguntasDoDia[perguntaAtual].n2}?
            </Text>

            <View style={styles.opcoesContainer}>
              {perguntasDoDia[perguntaAtual].op.map((op, idx) => (
                <TouchableOpacity key={idx} style={styles.botaoOpcao} onPress={() => responder(op)}>
                  <Text style={styles.textoOpcao}>{op}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {estagio === 'vitoria' && (
          <View style={styles.card}>
            <Text style={styles.emojiGeral}>🏆</Text>
            <Text style={styles.tituloVitoria}>Desafio Concluído!</Text>
            <Text style={styles.descricao}>Você completou o Desafio Diário de hoje ({hoje}) com perfeição!</Text>
            <TouchableOpacity style={styles.botaoVoltarMenu} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.textoBotao}>Voltar ao Menu</Text>
            </TouchableOpacity>
          </View>
        )}

        {estagio === 'derrota' && (
          <View style={styles.card}>
            <Text style={styles.emojiGeral}>💥</Text>
            <Text style={styles.tituloDerrota}>Não foi desta vez!</Text>
            <Text style={styles.descricao}>Você errou uma resposta. Tente novamente!</Text>
            <TouchableOpacity style={styles.botaoIniciar} onPress={iniciarDesafio}>
              <Text style={styles.textoBotao}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', paddingTop: 40 },
  header: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  botaoVoltar: { backgroundColor: '#34495e', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  textoBotaoVoltar: { color: '#fff', fontWeight: 'bold' },
  dataTexto: { color: '#f1c40f', fontWeight: 'bold', fontSize: 14 },
  conteudo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#34495e', padding: 25, borderRadius: 16, width: '100%', alignItems: 'center', elevation: 5 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#f1c40f', marginBottom: 10 },
  subtitulo: { fontSize: 16, color: '#bdc3c7', marginBottom: 10 },
  pergunta: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginVertical: 20, textAlign: 'center' },
  descricao: { fontSize: 16, color: '#ecf0f1', textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  opcoesContainer: { width: '100%' },
  botaoOpcao: { backgroundColor: '#1abc9c', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginVertical: 6 },
  textoOpcao: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  botaoIniciar: { backgroundColor: '#e67e22', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 10, width: '100%', alignItems: 'center' },
  botaoVoltarMenu: { backgroundColor: '#2ecc71', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 10, width: '100%', alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emojiGeral: { fontSize: 50, marginBottom: 10 },
  tituloVitoria: { fontSize: 24, fontWeight: 'bold', color: '#2ecc71', marginBottom: 10 },
  tituloDerrota: { fontSize: 24, fontWeight: 'bold', color: '#e74c3c', marginBottom: 10 },
});