import React, { useState, useEffect } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const { dx, dy } = gestureState;

      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        setDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    },
  });

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [snake]);

  const moveSnake = () => {
    if (!gameOver) {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      newSnake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFoodPosition());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }
  };

  const checkCollision = () => {
    const head = snake[0];

    if (
      head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
    }
  };

  const generateFoodPosition = () => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    return { x, y };
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.board}>
        <View style={styles.leftBorder} />
        <View style={styles.innerBoard}>
          {snake.map((segment, index) => (
            <View key={index} style={[styles.segment, { top: segment.y * 20, left: segment.x * 20 }]} />
          ))}
          <View style={[styles.food, { top: food.y * 20, left: food.x * 20 }]} />
        </View>
        <View style={styles.rightBorder} />
      </View>
      {gameOver && <Text style={styles.gameOverText}>Game Over!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    position: 'relative',
  },
  leftBorder: {
    width: 20,
    backgroundColor: '#000',
  },
  innerBoard: {
    width: 400,
    height: 400,
    backgroundColor: '#fff',
    position: 'relative',
  },
  rightBorder: {
    width: 20,
    backgroundColor: '#000',
  },
  segment: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SnakeGame;
