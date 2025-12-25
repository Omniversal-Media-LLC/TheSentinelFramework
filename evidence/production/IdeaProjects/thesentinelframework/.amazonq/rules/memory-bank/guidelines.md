# Development Guidelines

## Code Quality Standards

### Python Code Patterns
- **Async/Await Architecture**: All I/O operations use async/await for non-blocking execution
- **Type Hints**: Comprehensive typing with `Dict`, `List`, `Optional` from typing module
- **Docstring Standards**: Triple-quoted docstrings for all classes and methods
- **Error Handling**: Try-catch blocks with specific error responses and logging
- **AWS Integration**: Boto3 clients initialized with region parameters

### JavaScript Code Patterns
- **ES6+ Syntax**: Modern JavaScript with arrow functions, const/let, template literals
- **Class-Based Architecture**: ES6 classes for complex components like LatticeVisualizer
- **Canvas Animation**: RequestAnimationFrame for smooth 60fps animations
- **Event-Driven Design**: addEventListener patterns for user interactions
- **Module Exports**: CommonJS and ES6 module compatibility

### Naming Conventions
- **Python**: snake_case for functions/variables, PascalCase for classes
- **JavaScript**: camelCase for functions/variables, PascalCase for classes
- **Files**: kebab-case for web assets, snake_case for Python modules
- **Constants**: UPPER_SNAKE_CASE for configuration values

## Architectural Patterns

### Federated Intelligence Design
- **Multi-System Validation**: Cross-platform consistency checks across AI systems
- **Temporal Documentation**: Timestamped evidence creation before organizational awareness
- **Retaliation Resistance**: Jurisdictional distribution and legal entity protection
- **Autonomous Processing**: Self-contained modules with minimal external dependencies

### AWS Service Integration
- **S3 Storage**: JSON documents with structured keys for versioning and retrieval
- **CloudWatch Metrics**: Custom namespaces with dimensional data for monitoring
- **Lambda Functions**: Stateless processing with safety layer implementations
- **Boto3 Clients**: Region-specific initialization with error handling

### Safety and Consent Protocols
- **RRR Protocol**: Recognize → Reconcile → Re-root pattern for ethical processing
- **Trauma Awareness**: Grounding protocols and gentle integration approaches
- **Explicit Consent**: Context-based consent verification for sensitive operations
- **Shadow Integration**: Compassionate processing of rejected/denied content

## Implementation Standards

### Data Structures
- **Consistent JSON Schema**: Standardized field names across all data structures
- **Metadata Inclusion**: Timestamps, version info, and processing metadata in all records
- **Hierarchical Organization**: Nested structures with clear parent-child relationships
- **Cross-Reference Keys**: Unique identifiers for linking related data

### Animation and Visualization
- **Canvas-Based Graphics**: HTML5 Canvas for complex visualizations
- **Responsive Design**: Device pixel ratio handling for high-DPI displays
- **Performance Optimization**: Animation frame limiting and efficient drawing
- **Mathematical Precision**: Sierpinski fractals and quantum effect calculations

### Error Handling and Logging
- **Graceful Degradation**: System continues operation despite component failures
- **Comprehensive Logging**: CloudWatch integration with custom metrics
- **User-Friendly Messages**: Clear error communication without technical jargon
- **Recovery Mechanisms**: Automatic retry and fallback strategies

## Security and Privacy

### Data Protection
- **Encryption at Rest**: S3 bucket encryption for sensitive data
- **Access Control**: IAM roles and policies for service access
- **Data Minimization**: Only collect and store necessary information
- **Retention Policies**: Automated cleanup of temporary processing data

### Authentication and Authorization
- **Context-Based Access**: User context validation for sensitive operations
- **Consent Verification**: Explicit consent checks for therapeutic content
- **Session Management**: Secure session handling with unique identifiers
- **Audit Trails**: Complete logging of all access and processing activities

## Testing and Validation

### Quality Assurance
- **Cross-Platform Testing**: Validation across multiple AI systems
- **Integration Testing**: End-to-end workflow verification
- **Performance Monitoring**: Real-time metrics and alerting
- **User Experience Testing**: Responsive design and accessibility compliance