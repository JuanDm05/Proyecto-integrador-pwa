import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeminiService } from './gemini';

describe('GeminiService (Integración HTTP)', () => {
  let service: GeminiService;
  let httpMock: HttpTestingController; // Herramienta para simular el servidor
  const apiUrl = '/api/gemini'; // URL que usa el servicio

  // Datos de prueba
  const MOCK_RESPUESTA = { 
    candidates: [{ 
      content: 'Respuesta simulada de Gemini.' 
    }] 
  };
  const TEST_MESSAGE = '¿Qué es Angular?';

  beforeEach(() => {
    TestBed.configureTestingModule({
      // 1. Importar el módulo de simulación HTTP
      imports: [HttpClientTestingModule], 
      // 2. Proveer el servicio que queremos probar
      providers: [GeminiService]
    });
    
    service = TestBed.inject(GeminiService);
    // 3. Obtener el controlador para interceptar las llamadas HTTP
    httpMock = TestBed.inject(HttpTestingController); 
  });
  
  afterEach(() => {
    // 4. Verificar que no haya solicitudes HTTP pendientes al final de la prueba
    httpMock.verify(); 
  });

  // --- Prueba Unitaria Básica (Sanity Check) ---
  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // --- Prueba de Integración: Envío Exitoso ---
  it('sendMessage() debería hacer un POST a la API y retornar la respuesta exitosa', (done) => {
    // 1. Suscribirse al Observable y definir lo que debe pasar cuando hay éxito
    service.sendMessage(TEST_MESSAGE).subscribe(response => {
      expect(response).toEqual(MOCK_RESPUESTA);
      done(); // Señaliza que la prueba asíncrona ha terminado exitosamente
    });

    // 2. Interceptar la solicitud
    const req = httpMock.expectOne(apiUrl);
    
    // 3. Verificar que sea un POST y que el cuerpo contenga el mensaje
    expect(req.request.method).toBe('POST');
    expect(req.request.body.contents[0].parts[0].text).toBe(TEST_MESSAGE);
    
    // 4. Simular la respuesta del servidor con los datos de prueba
    req.flush(MOCK_RESPUESTA); 
  });
  
  // --- Prueba de Integración: Manejo de Error 500 ---
  it('sendMessage() debería manejar errores del servidor (status 500) a través de handleApiError', (done) => {
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };
    const errorMessage = 'Error interno del servidor de Vercel. (Posiblemente la API Key no está cargada correctamente en Vercel).';

    // 1. Suscribirse, esperando que se ejecute el bloque 'error'
    service.sendMessage(TEST_MESSAGE).subscribe({
      next: () => fail('Se esperaba que fallara la solicitud, pero fue exitosa.'),
      error: (error) => {
        // 3. Verificar que el error emitido por el servicio contenga el mensaje de error personalizado
        expect(error.message).toContain(errorMessage);
        done();
      }
    });

    // 2. Interceptar y simular una respuesta de error 500
    const req = httpMock.expectOne(apiUrl);
    req.flush('Simulated Server Error', errorResponse);
  });
  
  // --- Prueba de Integración: Manejo de Mensaje Vacío ---
  it('sendMessage() debería lanzar un error si el mensaje está vacío', (done) => {
    // Solo necesitamos probar esto con el bloque de error
    service.sendMessage(' ').subscribe({
      next: () => fail('No debería permitir un mensaje vacío.'),
      error: (error) => {
        // 2. Verificar el mensaje de error para el mensaje vacío
        expect(error.message).toContain('Mensaje vacío');
        done();
      }
    });
    // ¡Ojo! No se llama a httpMock.expectOne() porque el error se lanza antes de hacer la solicitud.
  });
});