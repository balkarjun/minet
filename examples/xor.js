const results = document.querySelectorAll("p");

let x_train = [[0, 0], [0, 1], [1, 0], [1, 1]];

let y_train = [[0], [1], [1], [0]];

function setup(){
	// 2 input nodes, 1 hidden layer of 4 nodes, 1 output node
	let nn = new NeuralNetwork(2, [4], 1);
	nn.train(x_train, y_train, epochs=40000);

	// displays predictions on screen
	for(let i = 0; i < results.length; i++){
		let value = x_train[i];
		results[i].innerText = `${value[0]} XOR ${value[1]} = ${nn.predict(value)[0].toFixed(3)}`;
	}
}

// retrain and predict values when button clicked
document.querySelector("button").addEventListener("click", setup);

setup();