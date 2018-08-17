/* Provides static methods for matrix operations */

class Matrix{
	/* Creates a matrix with dimensions (rows, cols) with values n*/
	constructor(rows, cols, value=0){
		if(rows <= 0 || cols <= 0){
			console.log("Matrix(rows, cols, value=0): rows and cols must be positive integers");
			return undefined;
		} else {
			this.rows = rows;
			this.cols = cols;
			this.values = [];

			for(let i = 0; i < this.rows; i++){
				this.values[i] = [];
				for(let j = 0; j < this.cols; j++){
					this.values[i][j] = value;
				}
			}
		}
	}

	/* Converts an array to a vector and returns it */
	static fromArray(arr){
		let m = new Matrix(arr.length, 1);
		for(let i = 0; i < arr.length; i++){
			m.values[i][0] = arr[i];
		}
		return m;
	}

	/* Converts matrix to array and returns it */
	static toArray(arr){
		let result = [];
		for(let i = 0; i < arr.rows; i++){
			for(let j = 0; j < arr.cols; j++){
				result.push(arr.values[i][j]);
			}
		}
		return result;
	}

	/* Returns matrix after setting all its values to specified value */
	static setValues(matrix, value){
		let result = new Matrix(matrix.rows, matrix.cols);
		for(let i = 0; i < matrix.rows; i++){
			for(let j = 0; j < matrix.cols; j++){
				result.values[i][j] = value;
			}
		}
		return result;
	}

	/* Returns matrix after randomizing values */
	static randomize(matrix){
		return Matrix.map(matrix, (x, i, j)=>Math.random()*2 - 1)
	}

	/* Returns result of element-wise addition */
	static add(matrix, n){
		if(n instanceof Matrix)
			return Matrix.map(matrix, (x, i, j)=>x + n.values[i][j]);
		else
			return Matrix.map(matrix, (x, i, j)=>x + n);
	}

	/* Returns result of element-wise subtraction */
	static subtract(matrix, n){
		if(n instanceof Matrix)
			return Matrix.map(matrix, (x, i, j)=>x - n.values[i][j]);
		else
			return Matrix.map(matrix, (x, i, j)=>x - n);
	}

	/* Returns result of element-wise multiplication */
	static multiply(matrix, n){
		if(n instanceof Matrix)
			return Matrix.map(matrix, (x, i, j)=>x * n.values[i][j]); // hadamard product
		else
			return Matrix.map(matrix, (x, i, j)=>x * n); // scalar product
	}

	/* Returns matrix after applying a function to its values */
	static map(a, func){
		if(a instanceof Matrix){
			let result = new Matrix(a.rows, a.cols);
			for(let i = 0; i < result.rows; i++){
				for(let j = 0; j < result.cols; j++){
					result.values[i][j] = func(a.values[i][j], i, j);
				}
			}
			return result;
		} else {
			console.log("Matrix.map(A, func): A must be a matrix");
			return undefined;
		}
	}

	/* Returns result of matrix multiplication */
	static matmul(a, b){
		if(a instanceof Matrix && b instanceof Matrix){
			if(a.cols !== b.rows){
				console.log("Matrix.matmul(A, B): Columns of A must match rows of B");
				return undefined;
			}
			else {
				let result = new Matrix(a.rows, b.cols);
				for(let i = 0; i < result.rows; i++){
					for(let j = 0; j < result.cols; j++){
						let sum = 0;
						for(let k = 0; k < a.cols; k++){
							sum += a.values[i][k] * b.values[k][j];
						}
						result.values[i][j] = sum;
					}
				}
				return result;
			}
		}
		else {
			console.log("Matrix.matmul(A, B): A and B must be matrices");
			return undefined;
		}
	}

	/* Returns transpose of matrix */
	static transpose(matrix){
		if(matrix instanceof Matrix){
			let result = new Matrix(matrix.cols, matrix.rows);
			for(let i = 0; i < matrix.rows; i++){
				for(let j = 0; j < matrix.cols; j++){
					result.values[j][i] = matrix.values[i][j];
				}
			}
			return result;
		} else {
			console.log("Matrix.transpose(A): A must be a matrix");
		}
	}

	/* Returns a copy of the matrix */
	static copy(matrix){
		return Matrix.map(matrix, (x, i, j)=>x);
	}

	/* Prints matrix values on console */
	static print(matrix){
		console.table(matrix.values);
	}
}
