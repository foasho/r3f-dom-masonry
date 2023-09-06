

/**
 * ShaderTextの文字列の中からuniform変数の宣言を抽出する
 * ※型も含めて抽出する 
 */
type UType = "float" | "vec2" | "vec3" | "vec4" | "mat4" | "sampler2D";
type Uniform = {
  type: UType;
  name: string;
}
export const extractUniforms = (shaderText: string): Uniform[] => {
  const uniforms: Uniform[] = [];
  const lines = shaderText.split("\n");
  for (const line of lines) {
    const match = line.match(/uniform\s+(float|vec2|vec3|vec4|mat4|sampler2D)\s+(\w+)\s*;/);
    if (match) {
      const type = match[1];
      const name = match[2];
      // typeがUTypeに含まれているかチェック
      if (type === "float" || type === "vec2" || type === "vec3" || type === "vec4" || type === "mat4" || type === "sampler2D") {
        uniforms.push({ type, name });
      }
    }
  }
  return uniforms;
}


/**
 * fragmentShaderとvertexShaderをUniformsを抽出して結合する
 */
export const getShaderUniforms = (fragmentShader: string | undefined, vertexShader: string | undefined): Uniform[] => {
  const fragmentUniforms = fragmentShader ? extractUniforms(fragmentShader) : [];
  const vertexUniforms = vertexShader ? extractUniforms(vertexShader) : [];
  return [...fragmentUniforms, ...vertexUniforms];
}

/**
 * Uniformsの初期値を取得する
 * @param type 
 * @returns 
 */
export const getInitUniformValue = (type: UType): number | number[] => {
  switch (type) {
    case "float":
      return 0;
    case "vec2":
      return [0, 0];
    case "vec3":
      return [0, 0, 0];
    case "vec4":
      return [0, 0, 0, 0];
    case "mat4":
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0 ,1, 0, 0, 0, 0, 1];
    case "sampler2D":
      return 0;
  }
}
