const { withProjectBuildGradle } = require("@expo/config-plugins");

function addJvmTargetBlock(buildGradle) {
  const marker = "// Added by with-kotlin-jvm-target-17";
  if (buildGradle.includes(marker)) {
    return buildGradle; // idempotent
  }

  const kotlinSnippet = `\n${marker}\nallprojects {\n    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {\n        kotlinOptions {\n            jvmTarget = \"17\"\n        }\n    }\n}\n`;

  return buildGradle + kotlinSnippet;
}

module.exports = function withKotlinJvmTarget17(config) {
  return withProjectBuildGradle(config, (gradleConfig) => {
    gradleConfig.modResults.contents = addJvmTargetBlock(
      gradleConfig.modResults.contents
    );
    return gradleConfig;
  });
}; 