class NeuralNetwork{

	/* Initializes the neural network
	 * a: inputNode size or reference to a neural network
	 * b: array of hiddenNode sizes
	 * c: outputNode size
	*/
	constructor(a, b, c, activation="sigmoid"){
		// if a neural network is passed, make a deep copy of its parameters
		if(a instanceof NeuralNetwork){
			this.weights = [];
			this.biases = [];
			for(let i = 0; i < a.weights.length; i++){
				this.weights.push(Matrix.copy(a.weights[i]));
				this.biases.push(Matrix.copy(a.biases[i]));
			}
			this.layerSizes = a.layerSizes.slice();
			this.activation = a.activation;
			this.learningRate = a.learningRate;
		}else{
			this.weights = [];
			this.biases = [];
			this.layerSizes = [a, ...b, c];
			this.activation = this.getActivation(activation);
			this.learningRate = 0.1;

			for(let i = 1; i < this.layerSizes.length; i++){
				let matrix = new Matrix(this.layerSizes[i], this.layerSizes[i-1]);
				matrix = Matrix.randomize(matrix);
				this.weights.push(matrix);

				let biases = new Matrix(this.layerSizes[i], 1);
				biases = Matrix.randomize(biases);
				this.biases.push(biases);
			}
		}
	}

  /* Propagates through network and returns layer values */
  feedforward(inputArray){
    let layerValues = [Matrix.fromArray(inputArray)];
    for(let i = 0; i < this.weights.length; i++){
      let values = Matrix.matmul(this.weights[i], layerValues[i]);
      values = Matrix.add(values, this.biases[i]);
      values = Matrix.map(values, this.activation.func);
      layerValues.push(values);
    }
    return layerValues;
  }

  /* Returns predicted output for given input */
  predict(inputArray){
    let layerValues = this.feedforward(inputArray);
    return Matrix.toArray(layerValues[layerValues.length - 1]);
  }

	/* Modifies weights using backpropagation */
	train(inputArray, targetArray, epochs=1){
    for(let count = 0; count < epochs; count++){
      // obtain random input and target values from arrays
      let index = Math.random()*inputArray.length | 0;
      let input = inputArray[index];
      let target = targetArray[index];
      // backpropagation
      let layerValues = this.feedforward(input);
      let targets = Matrix.fromArray(target);

      // error = targets - outputs
      let errors = Matrix.subtract(targets, layerValues[layerValues.length - 1]);

      // update weights
      for(let i = layerValues.length - 2; i >= 0; i--){
        let deltas = this.computeDeltas(layerValues[i], layerValues[i+1], errors);
				this.weights[i] = Matrix.add(this.weights[i], deltas[0]);
				this.biases[i] = Matrix.add(this.biases[i], deltas[1]);
        // compute next error
        let weightsT = Matrix.transpose(this.weights[i]);
        errors = Matrix.matmul(weightsT, errors);
      }
    }
	}

	/* Returns change in weights and biases */
	computeDeltas(layerLeft, layerRight, layerRightErrors){
		// gradient = dActivation(layerRight)*errors*learningRate
		let gradients = Matrix.map(layerRight, this.activation.dfunc);
		gradients = Matrix.multiply(gradients, layerRightErrors);
		gradients = Matrix.multiply(gradients, this.learningRate);
		// delta = gradient*transpose(layerLeft)
		let layerLeftT = Matrix.transpose(layerLeft);
		let deltaWeights = Matrix.matmul(gradients, layerLeftT);
		return [deltaWeights, gradients];
	}

	/* Returns activation function and its derivative. Defaults to sigmoid */
	getActivation(param){
		switch(param){
			case "tanh": return {func: x=>Math.tanh(x), dfunc: x=>1-(x*x)};
			case "relu": return {func: x=>Math.max(0, x), dfunc: x=>(x>0)?1:0};
			default: return {func: x=>1/(1 + Math.exp(-x)), dfunc: x=>x*(1-x)};
		}
	}

  /* Set learning rate */
  setRate(learningRate){
    this.learningRate = learningRate;
  }

	/* Returns a copy of this neural network */
	copy(){
		return new NeuralNetwork(this);
	}

	/* Changes a weight value based on mutation rate */
	mutate(rate){
		function mutate(val){
			let newValue = Math.random()*2 - 1;
			return (Math.random()<rate)?newValue:val;
		}

		for(let i = 0; i < this.weights.length; i++){
			this.weights[i] = Matrix.map(this.weights[i], mutate);
			this.biases[i] = Matrix.map(this.biases[i], mutate);
		}
	}
}
