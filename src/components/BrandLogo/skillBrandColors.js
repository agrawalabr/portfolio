/** Official / near-official brand colors for skill logos */
const SKILL_BRAND_COLORS = {
  Python: '#3776AB',
  SQL: '#336791',
  Scala: '#DC322F',
  PySpark: '#E25A1C',
  Java: '#007396',
  Go: '#00ADD8',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  'Shell/Bash': '#4EAA25',
  'Apache Spark': '#E25A1C',
  Kafka: '#231F20',
  Flink: '#E6526F',
  Airflow: '#017CEE',
  Hadoop: '#66CCFF',
  Hive: '#FDEE21',
  dbt: '#FF694B',
  'Great Expectations': '#FF5500',
  'ETL/ELT': '#6366F1',
  Snowflake: '#29B5E8',
  Databricks: '#FF3621',
  'Unity Catalog': '#FF3621',
  Iceberg: '#1B6BB3',
  'Delta Lake': '#00A1C9',
  Redshift: '#8C4FFF',
  BigQuery: '#669DF6',
  PostgreSQL: '#4169E1',
  MySQL: '#4479A1',
  MongoDB: '#47A248',
  Cassandra: '#1287B1',
  AWS: '#FF9900',
  GCP: '#4285F4',
  Azure: '#0078D4',
  Docker: '#2496ED',
  Kubernetes: '#326CE5',
  Terraform: '#7B42BC',
  'GitHub Actions': '#2088FF',
  'GitLab CI': '#FC6D26',
  Jenkins: '#D24939',
  Datadog: '#632CA6',
  Flask: '#000000',
  FastAPI: '#009688',
  Django: '#092E20',
  GraphQL: '#E10098',
  React: '#61DAFB',
  Angular: '#DD0031',
  HTML5: '#E34F26',
  CSS3: '#1572B6',
  'Tailwind CSS': '#06B6D4',
  Tableau: '#E97627',
  'Power BI': '#F2C811',
  QuickSight: '#FF9900',
  OpenAI: '#10A37F',
  Claude: '#D97757',
  'Hugging Face': '#FFD21E',
  PyTorch: '#EE4C2C',
  MLOps: '#0194E2',
};

export function brandColorFor(name, theme = 'light') {
  const c = SKILL_BRAND_COLORS[name];
  if (!c) return theme === 'dark' ? '#f2f2f4' : '#151515';
  // Near-black brands need a lift on dark theme
  if (theme === 'dark' && (c === '#000000' || c === '#231F20' || c === '#092E20')) {
    return '#e8e8ea';
  }
  // Yellow/light brands need contrast on light theme tiles
  if (theme === 'light' && (c === '#F7DF1E' || c === '#FDEE21' || c === '#FFD21E' || c === '#F2C811')) {
    return c;
  }
  return c;
}

export default SKILL_BRAND_COLORS;
