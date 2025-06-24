# Dose (frontend-quasar1)
Avaliação de Drinks
## Install the dependencies
```bash
yarn
# or
npm install
```
### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Format the files
```bash
yarn format
# or
npm run format
```

### Build the app for production
```bash
quasar build
```
### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

--- 

# Schema do BD
Veja os schemas:

const avaliacaoSchema = new Schema({
  nota: {
    type: Number,
    required: true,
    min: 0,  
    max: 10, 
  },
  comentario: {
    type: String,
    trim: true,
  },
  destilado_base: {
    type: String,
    trim: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  estabelecimento: {
    type: Schema.Types.ObjectId,
    ref: 'Estabelecimento',
    required: true,
  },
  drink: {
    type: Schema.Types.ObjectId,
    ref: 'Drink',
    required: true,
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }]
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_modificacao' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const categoriaSchema = new Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_modificacao' }
});

const drinkSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  descricao: {
    type: String,
    trim: true,
  },
  imagem: {
    type: String,
    trim: true,
  },
  usuario: { // FK
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Categoria',
    required: false,
  },
  ondeEncontrar: [{
    estabelecimento: {
      type: Schema.Types.ObjectId,
      ref: 'Estabelecimento',
      required: true,
    },
    preco: {
      type: Schema.Types.Decimal128, 
    },
    data_preco: {
      type: Date,
      default: Date.now,
    }
  }]
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_modificacao' }
});

const estabelecimentoSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  endereco: {
    type: String,
    trim: true,
  },
  imagem: {
    type: String,
    trim: true,
  },
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_modificacao' }
});

const usuarioSchema = new Schema({
  nome_usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: { 
    type: String, 
    required: false, 
    unique: false, 
    // sparse: true,
    lowercase: true, 
    trim: true 
  },
  hash_senha: {
    type: String,
    required: true,
  },
  credencial: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
    default: 0 // O padrão para novos usuários é 0 (usuário comum)
    // Mapeamento de Níveis:
    // 0: usuario
    // 1: adm de conteúdo
    // 2: adm de conteúdo e usuários
    // 3: owner
  },

  drinksFavoritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Drink'
  }],
  estabelecimentosFavoritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Estabelecimento'
  }],
  seguindo: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario' 
  }],
  seguidores: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }]
}, {
  timestamps: { createdAt: 'data_criacao', updatedAt: 'data_modificacao' } 
});