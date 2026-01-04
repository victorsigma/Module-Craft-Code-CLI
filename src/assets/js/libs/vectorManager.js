class VectorManager {
    /**
     * Regresa la resta de 2 Vectores
     * @param {{x: number, y: number, z:number}} vec1 
     * @param {{x: number, y: number, z:number}} vec2 
     * @returns 
     */
    static subtractVectors(vec1, vec2) {
        return {
            x: vec1.x - vec2.x,
            y: vec1.y - vec2.y,
            z: vec1.z - vec2.z
        };
    }

    /**
     * Regresa la suma de 2 Vectores
     * @param {{x: number, y: number, z:number}} vec1 
     * @param {{x: number, y: number, z:number}} vec2 
     * @returns 
     */
    static addVectors(vec1, vec2) {
        return {
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
            z: vec1.z + vec2.z
        };
    }

    /**
     * Regresa un Vector3 vacio
     * @returns {{x: number, y: number, z:number}} 
     */
    static emptyVector() {
        return { x: 0, y: 0, z: 0 };
    }

    /**
     * Regresa un Vector3 en un string
     * @param {{x: number, y: number, z:number}} vector
     * @returns {string} "x y z"
     */
    static toString(vector) {
        return `${vector.x} ${vector.y} ${vector.z}`
    }

    /**
     * Convierte un string a un Vector3 (Ejemplo: "10 10 -10")
     * @param {string} vectorString
     * @returns {{x: number, y: number, z:number}} 
     */
    static toVector3(vectorString) {
        const [vx, vy, vz] = vectorString.split(" ")

        const x = Number(vx) || 0
        const y = Number(vy) || 0
        const z = Number(vz) || 0

        return {x, y, z}
    }
}

export default VectorManager;