export class Utils{
    static validateCNPJ(cnpj:string){
        cnpj = cnpj.replace(/[^0-9]/g, '');

        if(cnpj.length != 14 || /^(\d)\1+$/.test(cnpj)){
            throw Error("Cnpj Inválido");
        }

        const calcularDigito = (base: string, weight: number[]): string => {
            const sum = base
                .split('')
                .reduce((acc, num, idx) => acc + parseInt(num) * weight[idx], 0);
            const rest = sum % 11;
            return rest < 2 ? '0' : (11 - rest).toString();
        };
    
        const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weightSecond = [6, ...weightsFirst];
    
        const firstDigit = calcularDigito(cnpj.slice(0, 12), weightsFirst);
        const secondDigit = calcularDigito(cnpj.slice(0, 12) + firstDigit, weightSecond);

        if(cnpj.endsWith(firstDigit + secondDigit) == false){
            throw Error("Cnpj Inválido");
        }
    }

}