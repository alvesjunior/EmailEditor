{{-- resources/views/emails/editor.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>Email Editor - Laravel</title>

    {{-- Importar o CSS e JS do Email Editor (apos npm run build) --}}
    <link rel="stylesheet" href="{{ asset('vendor/email-editor/email-editor.css') }}" />
    <script src="{{ asset('vendor/email-editor/email-editor.umd.js') }}"></script>

    <style>
        body { font-family: sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .form-header { max-width: 1200px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: space-between; }
        .form-header h1 { font-size: 22px; color: #333; }
        .form-header button {
            padding: 10px 24px;
            background: #1976d2;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
        }
        .form-header button:hover { background: #1565c0; }
        .editor-container { max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <form action="{{ route('emails.store') }}" method="POST" id="email-form">
        @csrf

        <div class="form-header">
            <h1>Criar Email</h1>
            <button type="submit">Salvar Email</button>
        </div>

        <div class="editor-container">
            {{-- A textarea que sera substituida pelo editor --}}
            <textarea id="email-content" name="email_content" style="display:none;">{{ old('email_content', $email->content ?? '') }}</textarea>
        </div>
    </form>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar o editor
            const editor = new EmailEditor({
                target: '#email-content',
                height: '700px',
                onChange: function(html) {
                    // O HTML e automaticamente salvo na textarea
                    console.log('Email atualizado');
                },
                // Callback para upload de imagens
                onUpload: async function(files) {
                    const formData = new FormData();
                    for (let i = 0; i < files.length; i++) {
                        formData.append('images[]', files[i]);
                    }

                    const response = await fetch('/api/upload-images', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        },
                        body: formData,
                    });

                    const data = await response.json();
                    return data.urls; // Retornar array de URLs
                },
            });

            // Ao submeter o formulario, garantir que o HTML esta na textarea
            document.getElementById('email-form').addEventListener('submit', function() {
                document.getElementById('email-content').value = editor.getHTML();
            });
        });
    </script>
</body>
</html>
