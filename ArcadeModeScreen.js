import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

// Critérios e explicações de divisibilidade
const divisibilityRules = {
  2: { rule: "Todo número par (terminado em 0, 2, 4, 6 ou 8) é divisível por 2.", example: "134 termina em 4, que é par, logo é divisível por 2." },
  3: { rule: "Um número é divisível por 3 se a soma dos seus algarismos for um número divisível por 3.", example: "273 (2 + 7 + 3 = 12). Como 12 é divisível por 3, 273 também é." },
  4: { rule: "Um número é divisível por 4 se os seus dois últimos algarismos formarem um número divisível por 4 ou terminarem em 00.", example: "516 termina em 16. Como 16 é divisível por 4, 516 também é." },
  5: { rule: "Todo número terminado em 0 ou 5 é divisível por 5.", example: "735 termina em 5, logo é divisível por 5." },
  6: { rule: "Um número é divisível por 6 se for par (divisível por 2) e a soma dos seus algarismos for divisível por 3 ao mesmo tempo.", example: "162 é par e a soma (1 + 6 + 2 = 9) é divisível por 3. Logo, é divisível por 6." },
  7: { rule: "Multiplique o último algarismo por 2 e subtraia do resto do número. Se o resultado for divisível por 7, o número original também é.", example: "203 -> 3 x 2 = 6. Depois, 20 - 6 = 14. Como 14 é divisível por 7, 203 também é." },
  8: { rule: "Um número é divisível por 8 se os seus três últimos algarismos forem divisíveis por 8 ou terminarem em 000.", example: "1120 termina em 120. Como 120 é divisível por 8, o número é divisível por 8." },
  9: { rule: "Um número é divisível por 9 se a soma de todos os seus algarismos for um número divisível por 9.", example: "477 (4 + 7 + 7 = 18). Como 18 é divisível por 9, 477 também é." },
};

export default function ArcadeModeScreen({ navigation }) {
  // Estados de Navegação e Contexto
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedOperation, setSelectedOperation] = useState('addition');
  const [selectedDivisor, setSelectedDivisor] = useState(2);

  // Estados do Jogo de Matemática Simples
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [mathOptions, setMathOptions] = useState([]);
  const [mathCombo, setMathCombo] = useState(0);

  // Estados do Jogo de Divisibilidade
  const [divisibilityNum, setDivisibilityNum] = useState(0);
  const [divisibilityCombo, setDivisibilityCombo] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, correct: null });

  // Auxiliar para gerar número aleatório de até 3 dígitos (1 a 999)
  const generateRandom3Digit = () => Math.floor(Math.random() * 999) + 1;

  // Iniciar jogo de operações simples
  const startMathGame = (op) => {
    setSelectedOperation(op);
    generateMathQuestion(op);
    setCurrentScreen('MathGame');
  };

  // Gerar pergunta e alternativas para operações simples
  const generateMathQuestion = (op) => {
    let n1 = generateRandom3Digit();
    let n2 = generateRandom3Digit();
    let correctAns = 0;

    if (op === 'addition') correctAns = n1 + n2;
    else if (op === 'subtraction') {
      if (n1 < n2) [n1, n2] = [n2, n1];
      correctAns = n1 - n2;
    } else if (op === 'multiplication') {
      n1 = Math.floor(Math.random() * 99) + 1;
      n2 = Math.floor(Math.random() * 9) + 1;
      correctAns = n1 * n2;
    } else if (op === 'division') {
      n2 = Math.floor(Math.random() * 20) + 1;
      correctAns = Math.floor(Math.random() * 50) + 1;
      n1 = correctAns * n2;
    }

    setNum1(n1);
    setNum2(n2);

    const optionsSet = new Set([correctAns]);
    while (optionsSet.size < 4) {
      const variance = Math.floor(Math.random() * 20) - 10;
      const fakeAns = correctAns + variance;
      if (fakeAns >= 0) optionsSet.add(fakeAns);
    }

    setMathOptions(Array.from(optionsSet).sort(() => Math.random() - 0.5));
  };

  // Validar resposta das operações simples
  const handleMathAnswer = (selectedAns) => {
    let correctAns = 0;
    if (selectedOperation === 'addition') correctAns = num1 + num2;
    else if (selectedOperation === 'subtraction') correctAns = num1 - num2;
    else if (selectedOperation === 'multiplication') correctAns = num1 * num2;
    else if (selectedOperation === 'division') correctAns = num1 / num2;

    if (selectedAns === correctAns) {
      setMathCombo(prev => prev + 1);
    } else {
      setMathCombo(0);
    }
    generateMathQuestion(selectedOperation);
  };

  // Iniciar fluxo de divisibilidade
  const startDivisibilityRules = (divisor) => {
    setSelectedDivisor(divisor);
    setCurrentScreen('DivisibilityExplanation');
  };

  // Iniciar jogo de divisibilidade após leitura
  const startDivisibilityGame = () => {
    generateDivisibilityQuestion();
    setCurrentScreen('DivisibilityGame');
  };

  // Gerar pergunta de divisibilidade
  const generateDivisibilityQuestion = () => {
    setFeedback({ show: false, correct: null });
    setDivisibilityNum(generateRandom3Digit());
  };

  // Validar resposta de divisibilidade (Sim ou Não)
  const handleDivisibilityAnswer = (playerSaysYes) => {
    const isActuallyDivisible = divisibilityNum % selectedDivisor === 0;
    const isCorrect = playerSaysYes === isActuallyDivisible;

    if (isCorrect) {
      setDivisibilityCombo(prev => prev + 1);
    } else {
      setDivisibilityCombo(0);
    }

    setFeedback({ show: true, correct: isCorrect });

    setTimeout(() => {
      generateDivisibilityQuestion();
    }, 1500);
  };

  const getOpSymbol = () => {
    if (selectedOperation === 'addition') return '+';
    if (selectedOperation === 'subtraction') return '-';
    if (selectedOperation === 'multiplication') return 'x';
    return '÷';
  };

  return (
    <View style={styles.container}>
      {/* TELA 1: HOME DO MODO ARCADE */}
      {currentScreen === 'Home' && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Qual dessas áreas queremos estudar hoje?</Text>
          
          <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('DivisibilitySelection')}>
            <Text style={styles.buttonText}>Critérios de Divisibilidade</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('ModalitySelection')}>
            <Text style={styles.buttonText}>Operações Simples</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>← Menu Principal</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA 2: ESCOLHA DA MODALIDADE */}
      {currentScreen === 'ModalitySelection' && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Escolha a modalidade!</Text>

          <TouchableOpacity style={styles.button} onPress={() => startMathGame('addition')}>
            <Text style={styles.buttonText}>Adição</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => startMathGame('subtraction')}>
            <Text style={styles.buttonText}>Subtração</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => startMathGame('multiplication')}>
            <Text style={styles.buttonText}>Multiplicação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => startMathGame('division')}>
            <Text style={styles.buttonText}>Divisão</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('Home')}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA 3: JOGO DE OPERAÇÕES SIMPLES */}
      {currentScreen === 'MathGame' && (
        <View style={styles.centerContent}>
          <Text style={styles.comboText}>🔥 Combo Atual: {mathCombo}</Text>
          
          <Text style={styles.questionText}>
            {num1} {getOpSymbol()} {num2} = ?
          </Text>

          <View style={styles.optionsContainer}>
            {mathOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleMathAnswer(option)}>
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => { setMathCombo(0); setCurrentScreen('ModalitySelection'); }}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA 4: SELEÇÃO DE CRITÉRIOS DE DIVISIBILIDADE */}
      {currentScreen === 'DivisibilitySelection' && (
        <View style={styles.centerContent}>
          <Text style={styles.title}>Escolha o número para ver o critério:</Text>
          
          <View style={styles.gridContainer}>
            {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <TouchableOpacity key={num} style={styles.gridButton} onPress={() => startDivisibilityRules(num)}>
                <Text style={styles.gridButtonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('Home')}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TELA 5: EXPLICAÇÃO DO CRITÉRIO */}
      {currentScreen === 'DivisibilityExplanation' && (
        <View style={styles.centerContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Critério do número {selectedDivisor}</Text>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Regra:</Text>
              <Text style={styles.cardText}>{divisibilityRules[selectedDivisor].rule}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Exemplo:</Text>
              <Text style={styles.cardText}>{divisibilityRules[selectedDivisor].example}</Text>
            </View>

            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={startDivisibilityGame}>
              <Text style={styles.buttonText}>Prosseguir 👉</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('DivisibilitySelection')}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* TELA 6: JOGO DE DIVISIBILIDADE */}
      {currentScreen === 'DivisibilityGame' && (
        <View style={styles.centerContent}>
          <Text style={styles.comboText}>🔥 Combo Atual: {divisibilityCombo}</Text>

          <Text style={styles.questionText}>
            O número <Text style={styles.highlightText}>{divisibilityNum}</Text> é divisível por {selectedDivisor}?
          </Text>

          {feedback.show ? (
            <View style={[styles.feedbackBox, feedback.correct ? styles.correctBox : styles.wrongBox]}>
              <Text style={styles.feedbackText}>
                {feedback.correct ? '🎉 Acertou!' : '❌ Errou!'}
              </Text>
            </View>
          ) : (
            <View style={styles.binaryOptionsContainer}>
              <TouchableOpacity style={[styles.choiceButton, styles.yesButton]} onPress={() => handleDivisibilityAnswer(true)}>
                <Text style={styles.buttonText}>SIM</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.choiceButton, styles.noButton]} onPress={() => handleDivisibilityAnswer(false)}>
                <Text style={styles.buttonText}>NÃO</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => { setDivisibilityCombo(0); setCurrentScreen('DivisibilitySelection'); }}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0052cc',
    paddingTop: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '85%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#0052cc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 30,
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  comboText: {
    fontSize: 20,
    color: '#ffcc00',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    width: '40%',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  gridButton: {
    backgroundColor: '#ffffff',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  gridButtonText: {
    color: '#0052cc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardTitle: {
    color: '#ffcc00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
  },
  highlightText: {
    color: '#ffcc00',
  },
  binaryOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  choiceButton: {
    width: '45%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#2ecc71',
  },
  noButton: {
    backgroundColor: '#e74c3c',
  },
  feedbackBox: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginVertical: 20,
  },
  correctBox: {
    backgroundColor: '#2ecc71',
  },
  wrongBox: {
    backgroundColor: '#e74c3c',
  },
  feedbackText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});