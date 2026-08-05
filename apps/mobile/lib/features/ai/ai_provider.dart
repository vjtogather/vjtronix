abstract interface class AiProvider { String get name; Stream<String> complete(List<AiMessage> messages); }
class AiMessage { const AiMessage({required this.role, required this.content}); final AiRole role; final String content; }
enum AiRole { system, user, assistant }
class UnconfiguredAiProvider implements AiProvider { @override String get name => 'unconfigured'; @override Stream<String> complete(List<AiMessage> messages) async* { yield 'An AI provider has not been configured yet.'; } }
