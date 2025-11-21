function calculate(event){
	with(event.layout.scope) {
		var left = Number(leftOperandText.getValue());
		var right = Number(rightOperandText.getValue());
		var result = NaN;
		
		switch (operatorCombo.getValue()) {
		case "+":
			result = left + right;
			break;
		case "-":
			result = left - right;
			break;
		case "*":
			result = left * right;
			break;
		case "/":
			result = left / right;
			break;
		}

		resultText.setValue(result);
	}
}
