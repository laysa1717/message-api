import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Message API - Itaú')
        .setDescription('API documentation for the Message API - Itaú')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    document.paths['/'] = {
        get: {
            summary: 'Health Check',
            description: 'Returns a hello world message',
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            example: 'Hello World!'
                        }
                    }
                }
            }
        }
    };

    document.paths['/v1/message'] = {
        post: {
            summary: 'Create Message',
            description: 'Creates a new message',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            example: {
                                content: 'mensagem de envio.',
                                sender: 'remetente@gmail.com',
                                status: 'enviado',
                            }
                        }
                    }
                }
            },
            responses: {
                '201': {
                    description: 'Message created successfully',
                    content: {
                        'application/json': {
                            example: {
                                success: true,
                                message: 'Message created successfully',
                                id: 'dc989721-607e-41e1-a13b-beb441404a04',
                                status: 201,
                            }
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                    content: {
                        'application/json': {
                            example: {
                                message: 'Expected double-quoted property name in JSON at position 76 (line 4 column 1)',
                                error: 'Bad Request',
                                statusCode: 400,
                            }
                        }
                    }
                }
            }
        }
    };

    document.paths['/v1/message/{messageId}'] = {
        get: {
            summary: 'Get Message by ID',
            description: 'Retrieves a message by its ID',
            parameters: [
                {
                    name: 'messageId',
                    in: 'path',
                    required: true,
                    description: 'ID of the message to retrieve',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            example: {
                                success: true,
                                data: {
                                    createdAt: 'Thu Aug 21 2025 01:36:56 GMT-0300 (Brasilia Standard Time)',
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eb',
                                    sender: 'remetente@gmail.com',
                                    content: 'mensagem de envio.',
                                    status: 'read',
                                    updatedAt: '2025-08-21T04:42:27.217Z',
                                },
                                status: 200,
                            },
                        },
                    },
                },
                '404': {
                    description: 'Message not found',
                    content: {
                        'application/json': {
                            example: {
                                statusCode: 404,
                                message: 'Message not found.',
                                details: {
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eba',
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    document.paths['/v1/message/senderMessage/{senderMessage}'] = {
        get: {
            summary: 'Get Messages by Sender',
            description: 'Retrieves messages by sender',
            parameters: [
                {
                    name: 'senderMessage',
                    in: 'path',
                    required: true,
                    description: 'Sender of the messages to retrieve',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            example: {
                                success: true,
                                data: {
                                    createdAt: 'Thu Aug 21 2025 01:36:56 GMT-0300 (Brasilia Standard Time)',
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eb',
                                    sender: 'remetente@gmail.com',
                                    content: 'mensagem de envio.',
                                    status: 'read',
                                    updatedAt: '2025-08-21T04:42:27.217Z',
                                },
                                status: 200,
                            },
                        },
                    },
                },
                '404': {
                    description: 'Message not found',
                    content: {
                        'application/json': {
                            example: {
                                statusCode: 404,
                                message: 'Message not found.',
                                details: {
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eba',
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    document.paths['/v1/message/rangeDate'] = {
        get: {
            summary: 'Get Messages by Date Range',
            description: 'Retrieves messages by date range',
            parameters: [
                {
                    name: 'dateInit',
                    in: 'query',
                    required: true,
                    description: 'Start date of the range',
                    schema: {
                        type: 'string',
                        format: 'date',
                    },
                },
                {
                    name: 'dateEnd',
                    in: 'query',
                    required: true,
                    description: 'End date of the range',
                    schema: {
                        type: 'string',
                        format: 'date',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            example: {
                                success: true,
                                data: {
                                    createdAt: 'Thu Aug 21 2025 01:36:56 GMT-0300 (Brasilia Standard Time)',
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eb',
                                    sender: 'remetente@gmail.com',
                                    content: 'mensagem de envio.',
                                    status: 'read',
                                    updatedAt: '2025-08-21T04:42:27.217Z',
                                },
                                status: 200,
                            },
                        },
                    },
                },
                '404': {
                    description: 'Message not found',
                    content: {
                        'application/json': {
                            example: {
                                statusCode: 404,
                                message: 'Message not found.',
                                details: {
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eba',
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    document.paths['/v1/message/messageId/{messageId}/status/{status}'] = {
        patch: {
            summary: 'Update Message Status',
            description: 'Updates the status of a message',
            parameters: [
                {
                    name: 'messageId',
                    in: 'path',
                    required: true,
                    description: 'ID of the message to update',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    name: 'status',
                    in: 'path',
                    required: true,
                    description: 'New status of the message',
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Message status updated successfully',
                    content: {
                        'application/json': {
                            example: {
                                success: true,
                                message: 'Message status updated successfully.',
                                status: 200,
                            },
                        },
                    },
                },
                '404': {
                    description: 'Message not found',
                    content: {
                        'application/json': {
                            example: {
                                statusCode: 404,
                                message: 'Message not found.',
                                details: {
                                    id: '47ddc295-ba63-4b2f-8a3f-90fa3e11b2eba',
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    SwaggerModule.setup('api', app, document);
}
