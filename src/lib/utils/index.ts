import { Color, Vector2, Vector3, Vector4, Texture } from "three";



/**
 * ShaderTextの文字列の中からuniform変数の宣言を抽出する
 * ※型も含めて抽出する
 */
type UTypeName = "float" | "vec2" | "vec3" | "vec4" | "mat4" | "sampler2D";
type UType = number | Color | Vector2 | Vector3 | Vector4 | Texture | number[];
export type UniformsProps = {
  [Key: string]: { value: UType };
};
type Uniform = {
  type: UTypeName;
  name: string;
};
export const extractUniforms = (shaderText: string): Uniform[] => {
  const uniforms: Uniform[] = [];
  const lines = shaderText.split("\n");
  for (const line of lines) {
    const match = line.match(/uniform\s+(float|vec2|vec3|vec4|mat4|sampler2D)\s+(\w+)\s*;/);
    if (match) {
      const type = match[1];
      const name = match[2];
      // typeがUTypeに含まれているかチェック
      if (
        type === "float" ||
        type === "vec2" ||
        type === "vec3" ||
        type === "vec4" ||
        type === "mat4" ||
        type === "sampler2D"
      ) {
        uniforms.push({ type, name });
      }
    }
  }
  return uniforms;
};

/**
 * fragmentShaderとvertexShaderをUniformsを抽出して結合する
 */
export const getShaderUniforms = (
  fragmentShader: string | undefined,
  vertexShader: string | undefined
): Uniform[] => {
  const fragmentUniforms = fragmentShader ? extractUniforms(fragmentShader) : [];
  const vertexUniforms = vertexShader ? extractUniforms(vertexShader) : [];
  return [...fragmentUniforms, ...vertexUniforms];
};

/**
 * Uniformsの初期値を取得する
 * @param type
 * @returns
 */
export const getInitUniformValue = (type: UTypeName): number | number[] => {
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
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    case "sampler2D":
      return 0;
  }
};

export const getUniformType = (value: UType): UTypeName | null => {
  if (typeof value === "number") {
    return "float";
  } else if (Array.isArray(value)) {
    if (value.length === 2) {
      return "vec2";
    } else if (value.length === 3) {
      return "vec3";
    } else if (value.length === 4) {
      return "vec4";
    } else if (value.length === 16) {
      return "mat4";
    }
  } else if (value instanceof Vector2) {
    return "vec2";
  } else if (value instanceof Vector3) {
    return "vec3";
  } else if (value instanceof Vector4) {
    return "vec4";
  } else if (value instanceof Color) {
    return "vec3";
  } else if (value instanceof Texture) {
    return "sampler2D";
  }
  return null;
};

export const convertUniformsPropsToUniforms = (uniformsProps: UniformsProps): Uniform[] => {
  const uniforms: Uniform[] = [];
  Object.keys(uniformsProps).forEach((key) => {
    const target = uniformsProps[key];
    const type = getUniformType(target.value);
    if (type){
      uniforms.push({ type, name: key });
    }
  });
  return uniforms;
};

/**
 * vertexShaderにUniformsを追加する
 * @param vertShader
 * @param uniforms
 */
export const appendVertShaderFromUniforms = (
  vertShader: string,
  uniforms: UniformsProps
): string => {
  let appendUniformText = "";
  const unis = convertUniformsPropsToUniforms(uniforms);
  for (const uniform of unis) {
    const newUniform = `uniform ${uniform.type} ${uniform.name}`;
    // 重複している場合は追加しない
    if (vertShader.includes(newUniform)) {
      continue;
    }
    appendUniformText += `${newUniform};\n`;
  }
  return appendUniformText + vertShader;
};

/**
 * fragmentShaderにUniformsを追加する
 * @param fragShader
 * @param uniforms
 */
export const appendFragShaderFromUniforms = (
  fragShader: string,
  uniforms: UniformsProps
): string => {
  let appendUniformText = "";
  console.log(uniforms);
  const unis = convertUniformsPropsToUniforms(uniforms);
  console.log(unis);
  for (const uniform of unis) {
    const newUniform = `uniform ${uniform.type} ${uniform.name}`;
    // 重複している場合は追加しない
    if (fragShader.includes(newUniform)) {
      continue;
    }
    appendUniformText += `${newUniform};\n`;
  }
  return appendUniformText + fragShader;
};
